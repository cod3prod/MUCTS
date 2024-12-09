import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat.entity';
import { FindChatProvider } from './find-chat.provider';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class DeleteChatProvider {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    private findChatProvider: FindChatProvider,
    private dataSource: DataSource
  ) {}

  async deleteChat(id: number, createdById: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      const userRepo = manager.getRepository(User);
      
      const chat = await this.findChatProvider.findChatById(id);
      if (!chat) {
        throw new WsException('Chat not found');
      }

      if (chat.createdBy.id !== createdById) {
        throw new WsException('Cannot delete chat created by another user');
      }

      const result = await chatRepo.softDelete(id);
      if (result.affected === 0) {
        throw new WsException('Chat not found');
      }

      await userRepo
        .createQueryBuilder()
        .update(User)
        .set({ chat: null })
        .where('chat.id = :chatId', { chatId: id })
        .execute();

      return {
        message: 'Successfully deleted chat',
        chatId: id,
        createdById,
      };
    });
  }
}
