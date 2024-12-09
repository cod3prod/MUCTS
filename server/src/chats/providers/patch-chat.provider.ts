import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat.entity';
import { PatchChatDto } from '../dtos/patch-chat.dto';
import { FindChatProvider } from './find-chat.provider';

@Injectable()
export class PatchChatProvider {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    private findChatProvider: FindChatProvider,
  ) {}

  async patchChat(id: number, patchChatDto: PatchChatDto) {
    const chat = await this.findChatProvider.findChatById(id);
    const updatedChat = this.chatsRepository.merge(chat, patchChatDto);
    return await this.chatsRepository.save(updatedChat);
  }
}
