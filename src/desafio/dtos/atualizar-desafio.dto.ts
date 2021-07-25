import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { DesafioStatus } from "../interfaces/desafio-status.enum";

export class AtualizarDesafioDto{
    @IsDateString()
    @IsNotEmpty()
    dataHoraDesafio: Date;

    @IsEnum(DesafioStatus)
    @IsOptional()
    status: DesafioStatus
}