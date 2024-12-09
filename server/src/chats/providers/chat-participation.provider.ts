import { Injectable } from "@nestjs/common";
import { FindChatProvider } from "./find-chat.provider";
import { UsersService } from "src/users/providers/users.service";
import { WsException } from "@nestjs/websockets";
import { PatchChatProvider } from "./patch-chat.provider";

@Injectable()
export class ChatParticipationProvider {
  constructor(
    private readonly findChatProvider: FindChatProvider,
    private readonly usersService: UsersService,
    private readonly patchChatProvider: PatchChatProvider,
  ) {}

  async joinChat(userId: number, chatId: number) {
    const chat = await this.findChatProvider.findChatById(chatId);
    if (!chat) {
      throw new WsException('Chat not found');
    }

    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new WsException('User not found');
    }

    if (chat.createdBy.id === userId) {
      throw new WsException('Cannot join chat created by yourself');
    }

    user.chat = chat;
    return await this.usersService.patchUser(userId, user);
  }

  async leaveChat(userId: number, chatId: number) {
    const chat = await this.findChatProvider.findChatById(chatId);
    if (!chat) {
      throw new WsException('Chat not found');
    }

    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new WsException('User not found');
    }

    if (chat.createdBy.id === userId) {
      throw new WsException('Cannot leave chat created by yourself');
    }

    const isUserInChat = user.chat.id === chat.id;
    if (!isUserInChat) {
      throw new WsException('User is not in this chat');
    }

    user.chat = null;
    chat.participants = chat.participants.filter((p) => p.id !== userId);

    await this.usersService.patchUser(userId, user);
    await this.patchChatProvider.patchChat(chat.id, chat);

    return {
      message: 'Successfully left the chat',
      chatId,
      userId,
    };
  }
}