import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../chat.entity';
import { FindChatProvider } from './find-chat.provider';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Message } from 'src/messages/message.entity';

@Injectable()
export class DeleteChatProvider {
  private readonly logger = new Logger(DeleteChatProvider.name);
  constructor(
    private findChatProvider: FindChatProvider,
    private dataSource: DataSource,
  ) {}

  async deleteChat(id: number, createdById: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      const userRepo = manager.getRepository(User);
      const messageRepo = manager.getRepository(Message);

      const chat = await this.findChatProvider.findChatById(id);
      if (!chat) {
        throw new WsException('Chat not found');
      }

      if (chat.createdBy.id !== createdById) {
        throw new WsException('Cannot delete chat created by another user');
      }

      const result = await chatRepo.delete(id);
      if (result.affected === 0) {
        throw new WsException('Chat not found');
      }

      await userRepo
        .createQueryBuilder()
        .update(User)
        .set({ chat: null })
        .where('chat.id = :chatId', { chatId: id })
        .execute();

      await messageRepo
        .createQueryBuilder()
        .delete()
        .where('chat.id = :chatId', { chatId: id })
        .execute();

      this.logger.log(`Chat ${id} deleted successfully`);

      return {
        chatId: id,
        createdBy: {
          id: createdById,
          username: chat.createdBy.username,
          nickname: chat.createdBy.nickname
        },
      };
    });
  }
}
