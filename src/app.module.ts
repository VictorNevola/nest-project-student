import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriaModule } from './categoria/categoria.module';
import { DesafioModule } from './desafio/desafio.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/smartranking", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    JogadoresModule,
    CategoriaModule,
    DesafioModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
