import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CriarCategoriaDto } from './dtos/criar-categoria-dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria-dto';
import { categoria } from './interface/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriaController {

    constructor(private readonly categoriaService: CategoriaService){}

    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria(
        @Body() criarCategoriaDto: CriarCategoriaDto
    ): Promise<categoria> {

        return await this.categoriaService.criarCategoria(criarCategoriaDto)

    }

    @Get()
    async consultarCategorias(): Promise<Array<categoria>> {
        return await this.categoriaService.consultarCategorias();
    }

    @Get('/:categoria')
    async consultarCategoriaPeloId(
        @Param('categoria') categoria: string
    ): Promise<categoria>
    {
        return await this.categoriaService.consultarCategoriaPeloId(categoria);
    }

    @Put('/:categoria')
    @UsePipes(ValidationPipe)
    async atualizarCategoria(
        @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
        @Param('categoria') categoria: string,
    ): Promise<void>
    {
        return await this.categoriaService.atualizarCategoria(categoria, atualizarCategoriaDto)
    }

    @Post('/:categoria/jogadores/:idJogador')
    async atribuirCategoriaJogador(
        @Param() params: string[]
    ): Promise<void>
    {
        await this.categoriaService.atribuirCategoriaJogador(params);
    }
}