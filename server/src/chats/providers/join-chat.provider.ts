import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';
import { Chat } from '../chat.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class JoinChatProvider {
  private readonly logger = new Logger(JoinChatProvider.name);
  constructor(private readonly dataSource: DataSource) {}

  async joinChat(userId: number, chatId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      const userRepo = manager.getRepository(User);

      const chat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants'],
        select: {
          id: true,
          title: true,
          createdAt: true,
          createdBy: {
            id: true,
            username: true,
            nickname: true,
          },
          participants: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      });

      if (!chat) {
        throw new WsException('Not found chat');
      }

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['chat'],
      });

      if (!user) {
        throw new WsException('Not found user');
      }

      if (user.chat && user.chat.id !== chatId) {
        throw new WsException('You already joined another chat');
      }

      if (user.chat && user.chat.id === chatId) {
        return chat;
      }

      user.chat = chat;
      await userRepo.save(user);

      const updatedChat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants'],
        select: {
          id: true,
          title: true,
          createdAt: true,
          createdBy: {
            id: true,
            username: true,
            nickname: true,
          },
          participants: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      });

      this.logger.log(`User ${user.username} joined chat ${chat.title}`);

      return updatedChat;
    });
  }
}
