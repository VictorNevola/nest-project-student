import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { DesafioSchema } from './interfaces/desafio.schema';
import { DesafioService } from './desafio.service';
import { DesafioController } from './desafio.controller';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { PartidaSchema } from './interfaces/partida.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Desafios", schema: DesafioSchema }]),
    MongooseModule.forFeature([{ name: "Partidas", schema: PartidaSchema }]),
    JogadoresModule,
    CategoriaModule
  ],
  providers: [DesafioService],
  controllers: [DesafioController]
})
export class DesafioModule {}
