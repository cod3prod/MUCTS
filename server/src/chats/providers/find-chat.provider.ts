import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../chat.entity';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class FindChatProvider {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async getAllChats() {
    return await this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.createdBy', 'createdBy')
      .leftJoinAndSelect('chat.participants', 'participants')
      .select([
        'chat.id',
        'chat.title',
        'chat.createdAt',
        'createdBy.id',
        'createdBy.username',
        'createdBy.nickname',
        'participants.id',
      ])
      .where('chat.deletedAt IS NULL')
      .getMany();
  }

  async findChatById(id: number) {
    const chat = await this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.createdBy', 'createdBy')
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'sender')
      .select([
        'chat',
        'createdBy.id',
        'createdBy.username',
        'createdBy.nickname',
        'participants.id',
        'participants.username',
        'participants.nickname',
        'messages.content',
        'messages.createdAt',
        'sender.id',
        'sender.username',
        'sender.nickname',
      ])
      .where('chat.id = :id', { id })
      .getOne();

    if (!chat) {
      throw new WsException('Chat not found');
    }
    return chat;
  }
}
