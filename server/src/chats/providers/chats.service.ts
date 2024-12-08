import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../chat.entity';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { MessagesService } from 'src/messages/providers/messages.service';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { CreateMessageDto } from 'src/messages/dtos/create-message.dto';
import { PatchChatDto } from '../dtos/patch-chat.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    private usersService: UsersService,
    private messagesService: MessagesService,
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

  async getAllChats() {
    const chats = await this.chatsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['createdBy', 'participants'],
      select: {
        id: true,
        title: true,
        createdAt: true,
        createdBy: { id: true, username: true, nickname: true },
      },
      loadRelationIds: {
        relations: ['participants'],
      },
    });

    return chats.map(chat => ({
      ...chat,
      participantsCount: chat.participants.length
    }));
  }

  async findChatById(id: number) {
    const chat = await this.chatsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'participants', 'messages', 'messages.sender'],
      select: {
        createdBy: { id: true, username: true, nickname: true },
        participants: { id: true, username: true, nickname: true },
        messages: {
          sender: { id: true, username: true, nickname: true },
          content: true,
          createdAt: true,
        },
      },
    });
    if (!chat) {
      throw new WsException('Chat not found');
    }
    return chat;
  }

  async addMessageToChat(chatId: number, createMessageDto: CreateMessageDto) {
    const chat = await this.findChatById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return await this.messagesService.createMessage(createMessageDto);
  }

  async patchChat(id: number, patchChatDto: PatchChatDto) {
    const chat = await this.findChatById(id);
    const updatedChat = this.chatsRepository.merge(chat, patchChatDto);
    return await this.chatsRepository.save(updatedChat);
  }

  async deleteChat(id: number, createdById: number) {
    const chat = await this.findChatById(id);
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

  async joinChat(userId: number, chatId: number) {
    const chat = await this.findChatById(chatId);
    if (!chat) {
      throw new WsException('Chat not found');
    }

    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new WsException('User not found');
    }

    if (chat.createdBy.id === userId) {
      throw new WsException('Cannot join chat created by yourself');
    }

    user.chat = chat;
    return await this.usersService.patchUser(userId, user);
  }

  async leaveChat(userId: number, chatId: number) {
    const chat = await this.findChatById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (chat.createdBy.id === userId) {
      throw new WsException('Cannot leave chat created by yourself');
    }

    const isUserInChat = user.chat.id === chat.id;
    if (!isUserInChat) {
      throw new WsException('User is not in this chat');
    }

    user.chat = null;
    chat.participants = chat.participants.filter((p) => p.id !== userId);

    await this.usersService.patchUser(userId, user);
    await this.patchChat(chat.id, chat);

    return {
      message: 'Successfully left the chat',
      chatId,
      userId,
    };
  }
}
