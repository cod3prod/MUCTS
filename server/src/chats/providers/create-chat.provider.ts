import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { Chat } from '../chat.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class CreateChatProvider {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private dataSource: DataSource,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const chatRepo = manager.getRepository(Chat);

      const createdBy = await userRepo.findOne({
        where: { id: createChatDto.createdById },
      });

      if (!createdBy) {
        throw new NotFoundException('Created by user not found');
      }

      if (createdBy.chat) {
        throw new ConflictException('User already has a chat');
      }

      const chat = chatRepo.create({
        ...createChatDto,
        createdBy,
      });

      await chatRepo.save(chat);

      createdBy.chat = chat;
      await userRepo.save(createdBy);

      return {
        id: chat.id,
        createdBy: {
          id: createdBy.id,
          username: createdBy.username,
          nickname: createdBy.nickname,
        },
      };
    });
  }
}
