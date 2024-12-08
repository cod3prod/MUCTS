import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { Chat } from "src/chats/chat.entity";

export class PatchUserDto extends PartialType(CreateUserDto) {
    chat?: Chat;
}
