import { IsOptional, IsString, MaxLength } from "class-validator";

export class PatchChatDto {
    @IsOptional()
    @IsString()
    @MaxLength(20)
    title?: string;
}
