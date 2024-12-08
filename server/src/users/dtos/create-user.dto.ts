import { IsNotEmpty, IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    nickname: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}