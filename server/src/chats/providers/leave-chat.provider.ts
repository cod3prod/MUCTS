import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';
import { Chat } from '../chat.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class LeaveChatProvider {
  private readonly logger = new Logger(LeaveChatProvider.name);
  constructor(private readonly dataSource: DataSource) {}
  async leaveChat(userId: number, chatId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      const userRepo = manager.getRepository(User);

      const chat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants'],
      });

      if (!chat) {
        throw new WsException('Not found Chat');
      }

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['chat'],
      });

      if (!user) {
        throw new WsException('Not found User');
      }

      if (chat.createdBy.id === userId) {
        throw new WsException('You cannot leave a chat you created');
      }

      user.chat = null;
      await userRepo.save(user);

      const updatedChat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants'],
      });

      this.logger.log(`User with ID ${user.username} left chat with ID ${chat.id}`);
      
      return updatedChat;
    });
  }
}
