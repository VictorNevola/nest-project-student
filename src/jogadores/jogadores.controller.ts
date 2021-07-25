import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador-dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('/api/v1/jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
        return await this.jogadoresService.criarJogador(criarJogadorDto);
    };

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() atualizarJogadorDto: AtualizarJogadorDto,
        @Param('_id', ValidacaoParametrosPipe) _id: string
    ) {
        return await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDto);
    };

    @Get()
    async consultarJogadores(): Promise<Jogador[]> {
        return this.jogadoresService.consultarTodosJogadores();
    };

    @Get('/:_id')
    async consultarJogadorPeloId(
        @Param('_id', ValidacaoParametrosPipe) _id: string
    ): Promise<Jogador[] | Jogador> {

        return this.jogadoresService.consultarJogadorPeloId(_id);
    };

    @Delete('/:_id')
    @UsePipes()
    async deletarJogador(
        @Param('_id', ValidacaoParametrosPipe) _id: string
    ): Promise<void> {
        return this.jogadoresService.deletarJogador(_id)
    }

}
