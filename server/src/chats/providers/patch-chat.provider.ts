import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../chat.entity';
import { PatchChatDto } from '../dtos/patch-chat.dto';
import { DataSource } from 'typeorm';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class PatchChatProvider {
  private logger = new Logger(PatchChatProvider.name);
  constructor(
    private dataSource: DataSource,
  ) {}

  async patchChat(id: number, patchChatDto: PatchChatDto) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      
      const chat = await chatRepo.findOne({
        where: { id },
        relations: ['createdBy', 'participants'],
        select: {
          id: true,
          title: true,
          createdAt: true,
          createdBy: { 
            id: true, 
            username: true, 
            nickname: true 
          },
          participants: {
            id: true,
            username: true,
            nickname: true
          }
        }
      });

      if (!chat) {
        throw new WsException('Chat not found');
      }

      const updatedChat = chatRepo.merge(chat, patchChatDto);
      
      this.logger.log(`${updatedChat.createdBy.username} updated chat ${updatedChat.id} successfully`);

      return await chatRepo.save(updatedChat);
    });
  }
}
