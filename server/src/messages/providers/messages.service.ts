import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../message.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { WsException } from '@nestjs/websockets';
import { User } from 'src/users/user.entity';
import { Chat } from 'src/chats/chat.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) 
    private messagesRepository: Repository<Message>,
    private dataSource: DataSource,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const chatRepo = manager.getRepository(Chat);
      const messageRepo = manager.getRepository(Message);

      const sender = await userRepo.findOne({
        where: { id: createMessageDto.senderId },
        relations: ['chat']
      });

      if (!sender) {
        throw new WsException('Sender not found');
      }

      const chat = await chatRepo.findOne({
        where: { id: createMessageDto.chatId },
        relations: ['participants']
      });

      if (!chat) {
        throw new WsException('Chat not found');
      }

      if (!sender.chat || sender.chat.id !== chat.id) {
        throw new WsException('User is not in this chat');
      }

      const message = messageRepo.create({
        content: createMessageDto.content,
        sender,
        chat
      });

      await messageRepo.save(message);

      return {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender: {
          id: sender.id,
          username: sender.username,
          nickname: sender.nickname
        },
        chatId: chat.id
      };
    });
  }

  async getMessagesByChatId(chatId: number) {
    const messages = await this.messagesRepository.find({
      where: { chat: { id: chatId } },
    });

    if(!messages) {
      throw new NotFoundException('Messages not found');
    }

    return messages;
  }

}
