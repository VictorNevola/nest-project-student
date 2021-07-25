import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

import { DesafioStatus } from './desafio-status.enum';

export interface Desafio extends Document {
    dataHoraDesafio: Date;
    status: DesafioStatus,
    dataHoraSolicatacao: Date,
    dataHoraResposta: Date,
    solicitante: Jogador
    categoria: String,
    jogadores: Array<Jogador>,
    partida: Partida
}

export interface Partida extends Document {
    categoria: String,
    jogadores: Array<Jogador>,
    def: Jogador,
    resultado: Array<Resultado>
}

export interface Resultado {
    set: string
}