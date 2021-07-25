import { Schema } from 'mongoose';

export const DesafioSchema = new Schema({
    dataHoraDesafio: Date,
    status: String,
    dataHoraSolicatacao: Date,
    dataHoraResposta: Date,
    categoria: String,
    solicitante: {
        type: Schema.Types.ObjectId,
        ref: "Jogador"
    },
    jogadores: [{
        type: Schema.Types.ObjectId,
        ref: "Jogador"
    }],
    partida: {
        type: Schema.Types.ObjectId,
        ref: "Partida"
    }

}, { timestamps: true, collection: 'desafios'});