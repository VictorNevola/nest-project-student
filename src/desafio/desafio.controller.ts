import { Controller, Post, UsePipes, ValidationPipe, Body, Get, Param, Query, Put, Delete } from '@nestjs/common';
import { DesafioService } from './desafio.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Controller('api/v1/desafio')
export class DesafioController {

    constructor(private readonly desafioService: DesafioService){}

    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(
        @Body() criarDesafioDto: CriarDesafioDto
    ): Promise<Desafio>{
        return await this.desafioService.criarDesafio(criarDesafioDto);
    }

    @Get()
    async consultaTodosDesafios(
        @Query('idJogador') _id: string
    ): Promise<Array<Desafio>> {
        return _id ?
        await this.desafioService.consultaDesafioPorJogador(_id)
        :
        await this.desafioService.consultaTodosDesafios();
        
    }
    
    @Put('/:idDesafio')
    @UsePipes(ValidationPipe)
    async atualizarDesafio(
        @Body() atualizarDesafioDto: AtualizarDesafioDto,
        @Param('idDesafio') idDesafio: string
    ): Promise<void>{
        return await this.desafioService.atualizarUmDesafio(idDesafio, atualizarDesafioDto);
    }

    @Delete('/:idDesafio')
    async deletarUmDesafio(
        @Param('idDesafio') idDesafio: string
    ):Promise<void>{
        return await this.desafioService.deletarUmDesafio(idDesafio);
    }
    
    @Post('/:idDesafio/partida')
    async atribuirDesafioPartida(
        @Param('idDesafio') idDesafio: string,
        @Body(ValidationPipe) atribuirDesafioPartida: AtribuirDesafioPartidaDto
    ): Promise<Desafio>{
        return await this.desafioService.atribuirDesafioPartida(idDesafio, atribuirDesafioPartida)
    }
}
