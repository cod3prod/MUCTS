import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateChatDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    title: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    createdById: number;
}
