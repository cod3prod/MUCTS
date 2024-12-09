import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { DataSource } from "typeorm";
import { Chat } from "../chat.entity";
import { User } from "src/users/user.entity";

@Injectable()
export class ChatParticipationProvider {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async joinChat(userId: number, chatId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      const userRepo = manager.getRepository(User);

      const chat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants']
      });

      if (!chat) {
        throw new WsException('Chat not found');
      }

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['chat']
      });

      if (!user) {
        throw new WsException('User not found');
      }

      if (chat.createdBy.id === userId) {
        throw new WsException('Cannot join chat created by yourself');
      }

      user.chat = chat;
      await userRepo.save(user);

      return user;
    });
  }

  async leaveChat(userId: number, chatId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      const userRepo = manager.getRepository(User);

      const chat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants']
      });

      if (!chat) {
        throw new WsException('Chat not found');
      }

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['chat']
      });

      if (!user) {
        throw new WsException('User not found');
      }

      if (chat.createdBy.id === userId) {
        throw new WsException('Cannot leave chat created by yourself');
      }

      if (!user.chat || user.chat.id !== chatId) {
        throw new WsException('User is not in this chat');
      }

      user.chat = null;
      await userRepo.save(user);

      return {
        message: 'Successfully left the chat',
        chatId,
        userId
      };
    });
  }
}