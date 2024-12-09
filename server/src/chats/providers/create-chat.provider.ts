import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../chat.entity';

@Injectable()
export class CreateChatProvider {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    private usersService: UsersService,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    const createdBy = await this.usersService.findUserById(
      createChatDto.createdById,
    );

    if (!createdBy) {
      throw new NotFoundException('Created by user not found');
    }

    const chat = this.chatsRepository.create(createChatDto);
    await this.chatsRepository.save(chat);

    createdBy.chat = chat;

    await this.usersService.patchUser(createdBy.id, {
      ...createdBy,
      chat: createdBy.chat,
    });

    return chat;
  }
}
