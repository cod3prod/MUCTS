import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const sender = await this.usersService.findUserById(createMessageDto.senderId);


    if(!sender) {
      throw new NotFoundException('Sender not found');
    }

    const message = this.messagesRepository.create(createMessageDto);
    await this.messagesRepository.save(message);
    return message;
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
