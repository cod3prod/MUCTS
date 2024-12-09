import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat.entity';
import { FindChatProvider } from './find-chat.provider';
import { UsersService } from 'src/users/providers/users.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class DeleteChatProvider {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    private findChatProvider: FindChatProvider,
    private usersService: UsersService,
  ) {}

  async deleteChat(id: number, createdById: number) {
    const chat = await this.findChatProvider.findChatById(id);
    if (!chat) {
      throw new WsException('Chat not found');
    }

    if (chat.createdBy.id !== createdById) {
      throw new WsException('Cannot delete chat created by another user');
    }

    const result = await this.chatsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new WsException('Chat not found');
    }

    chat.participants.forEach((p) => {
      p.chat = null;
      this.usersService.patchUser(p.id, p);
    });

    return {
      message: 'Successfully deleted chat',
      chatId: id,
      createdById,
    };
  }
}
