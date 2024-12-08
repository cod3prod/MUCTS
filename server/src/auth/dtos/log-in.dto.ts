import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class LogInDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

