import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriaService } from 'src/categoria/categoria.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';

import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio, Partida } from './interfaces/desafio.interface';

@Injectable()
export class DesafioService {
    constructor(
        @InjectModel('Desafios') private readonly desafioModel: Model<Desafio>,
        @InjectModel('Partidas') private readonly partidaModel: Model<Partida>,
        private readonly jogadoresService: JogadoresService,
        private readonly categoriaService: CategoriaService
    ) { }

    async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        const { jogadores, solicitante } = criarDesafioDto;

        const solicitanteEhJogadorDaPartida = jogadores.find(jogador => jogador._id === solicitante);

        if (!solicitanteEhJogadorDaPartida) throw new BadRequestException(`O solicitante deve ser um jogador da partida!`);

        const categoriaDoJogador = await this.categoriaService.consultaCategoriaDoJogador(solicitante);

        if (!categoriaDoJogador) throw new BadRequestException(`O solicitante precisa esta registrado em uma categoria!`);

        await Promise.all(
            jogadores.map(async jogador => await this.jogadoresService.consultarJogadorPeloId(jogador._id))
        );

        const desafioCriado = new this.desafioModel(criarDesafioDto);
        desafioCriado.categoria = categoriaDoJogador.categoria;
        desafioCriado.dataHoraSolicatacao = new Date();
        desafioCriado.status = DesafioStatus.PENDENTE;

        return (await desafioCriado.save()).populate('jogadores').execPopulate();

    }

    async consultaTodosDesafios(): Promise<Array<Desafio>> {
        return await this.desafioModel.find()
            .populate('jogadores')
            .populate('solicitante')
            .populate('partida')
            .exec();
    }

    async consultaDesafioPorJogador(idJogador: any): Promise<Array<Desafio>> {

        await this.jogadoresService.consultarJogadorPeloId(idJogador);

        return await this.desafioModel.find().where('jogadores').in(idJogador)
            .populate('jogadores')
            .populate('solicitante')
            .populate('partida')
            .exec();

    }

    async atualizarUmDesafio(idDesafio: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
        const { status, dataHoraDesafio } = atualizarDesafioDto;

        const desafioEncontrado = await this.capturaDesafio(idDesafio);

        desafioEncontrado.dataHoraDesafio = dataHoraDesafio;
        desafioEncontrado.status = status ? status : desafioEncontrado.status;
        desafioEncontrado.dataHoraResposta = status ? new Date() : desafioEncontrado.dataHoraResposta;

        await this.desafioModel.findByIdAndUpdate({ _id: idDesafio }, { $set: desafioEncontrado }).exec();

    }

    async deletarUmDesafio(idDesafio: string): Promise<void> {

        const desafioEncontrado = await this.capturaDesafio(idDesafio);
        desafioEncontrado.status = DesafioStatus.CANCELADO;

        await this.desafioModel.findByIdAndUpdate({ _id: idDesafio }, { $set: desafioEncontrado }).exec();

    }

    async atribuirDesafioPartida(idDesafio: string, atribuirDesafioPartida: AtribuirDesafioPartidaDto): Promise<Desafio> {

        await this.jogadoresService.consultarJogadorPeloId(String(atribuirDesafioPartida.def));
        const desafioEncontrado = await this.capturaDesafio(idDesafio);
        const jogadorNoDesafio = desafioEncontrado.jogadores.filter(jogador => String(jogador._id) === String(atribuirDesafioPartida.def));

        if (jogadorNoDesafio.length === 0) throw new BadRequestException(`O jogador vencedor não faz parte do desafio!`);

        const partidaCriada = new this.partidaModel(atribuirDesafioPartida)

        partidaCriada.categoria = desafioEncontrado.categoria;
        partidaCriada.jogadores = desafioEncontrado.jogadores;

        const resultado = await partidaCriada.save();

        desafioEncontrado.status = DesafioStatus.REALIZADO;
        desafioEncontrado.partida = resultado._id;

        try {
            return await this.desafioModel.findByIdAndUpdate(idDesafio, { $set: desafioEncontrado }).exec();
        } catch (error) {
            await this.partidaModel.findByIdAndRemove(resultado._id).exec();
            throw new InternalServerErrorException();
        }

    }

    private async capturaDesafio(idDesafio: string) {

        const desafioEncontrado = await this.desafioModel.findOne({ _id: idDesafio }).populate('jogadores').exec();

        if (!desafioEncontrado) throw new NotFoundException(`Desafio ${idDesafio} não encontrado`);

        return desafioEncontrado;

    }
}
