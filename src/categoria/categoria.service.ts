import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria-dto';

import { CriarCategoriaDto } from './dtos/criar-categoria-dto';
import { categoria } from './interface/categoria.interface';

@Injectable()
export class CategoriaService {

    constructor(
        @InjectModel('categoria') private readonly categoriaModel: Model<categoria>,
        private readonly jogadoresService: JogadoresService
    ) { }

    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<categoria> {
        const { categoria } = criarCategoriaDto;

        const categoriaEncontrada = await this.procuraCategoriaPeloNome(categoria);

        if (categoriaEncontrada) {
            throw new BadRequestException(`Categoria ${categoria} já cadastrada`);
        }

        const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
        return await categoriaCriada.save();

    }

    async consultarCategorias(): Promise<Array<categoria>> {
        return await this.categoriaModel.find().populate("jogadores").exec();
    }

    async consultarCategoriaPeloId(categoria: string): Promise<categoria> {
        const categoriaEncontrada = await this.procuraCategoriaPeloNome(categoria);

        if (!categoriaEncontrada) {
            throw new NotFoundException(`Categoria ${categoria} não encontrada`);
        }

        return categoriaEncontrada;
    }

    async atualizarCategoria(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
        const categoriaEncontrada = await this.procuraCategoriaPeloNome(categoria);

        if (!categoriaEncontrada) {
            throw new NotFoundException(`Categoria ${categoria} não encontrada`);
        }

        await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto });

    }

    async atribuirCategoriaJogador(params: string[]): Promise<void> {

        const categoria = params['categoria'];
        const idJogador = params['idJogador'];

        await this.jogadoresService.consultarJogadorPeloId(idJogador);

        const categoriaEncontrada = await this.procuraCategoriaPeloNome(categoria);
        const jogadorJaCadastradoNaCategoria = await this.categoriaModel.findOne({categoria}).where('jogadores').in(idJogador).exec();

        if (!categoriaEncontrada) {
            throw new NotFoundException(`Categoria ${categoria} não encontrada`);
        }

        if (jogadorJaCadastradoNaCategoria) {
            throw new NotFoundException(`Jogador ${idJogador} já cadastrado na categoria ${categoria}`);
        }

        categoriaEncontrada.jogadores.push(idJogador)
        await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: categoriaEncontrada }).exec();


    }

    async consultaCategoriaDoJogador(idJogador: any): Promise<categoria>{
        return await this.categoriaModel.findOne().where('jogadores').in(idJogador).exec();
    }

    private async procuraCategoriaPeloNome(categoria: string): Promise<categoria> {
        return await this.categoriaModel.findOne({ categoria }).exec();
    }

}
