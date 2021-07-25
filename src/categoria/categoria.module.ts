import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './interface/categoria.schema';
import { JogadoresModule } from 'src/jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "categoria", schema: CategoriaSchema }]),
    JogadoresModule
  ],
  providers: [CategoriaService],
  controllers: [CategoriaController],
  exports: [CategoriaService]
})
export class CategoriaModule { }
