import { Injectable } from '@nestjs/common';
import { MessagesService } from 'src/messages/providers/messages.service';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { CreateMessageDto } from 'src/messages/dtos/create-message.dto';
import { PatchChatDto } from '../dtos/patch-chat.dto';
import { FindChatProvider } from './find-chat.provider';
import { CreateChatProvider } from './create-chat.provider';
import { DeleteChatProvider } from './delete-chat.provider';
import { PatchChatProvider } from './patch-chat.provider';
import { JoinChatProvider } from './join-chat.provider';
import { LeaveChatProvider } from './leave-chat.provider';

@Injectable()
export class ChatsService {
  constructor(
    private messagesService: MessagesService,
    private readonly createChatProvider: CreateChatProvider,
    private readonly findChatProvider: FindChatProvider,
    private readonly deleteChatProvider: DeleteChatProvider,
    private readonly patchChatProvider: PatchChatProvider,
    private readonly joinChatProvider: JoinChatProvider,
    private readonly leaveChatProvider: LeaveChatProvider
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    return await this.createChatProvider.createChat(createChatDto);
  }

  async getAllChats() {
    return await this.findChatProvider.getAllChats();
  }

  async findChatById(id: number) {
    return await this.findChatProvider.findChatById(id);
  }

  async addMessageToChat(chatId: number, createMessageDto: CreateMessageDto) {
    return await this.messagesService.createMessage({
      ...createMessageDto,
      chatId
    });
  }

  async patchChat(id: number, patchChatDto: PatchChatDto) {
    return await this.patchChatProvider.patchChat(id, patchChatDto);
  }

  async deleteChat(id: number, createdById: number) {
    return await this.deleteChatProvider.deleteChat(id, createdById);
  }

  async joinChat(userId: number, chatId: number) {
    return await this.joinChatProvider.joinChat(userId, chatId);
  }

  async leaveChat(userId: number, chatId: number) {
    return await this.leaveChatProvider.leaveChat(userId, chatId);
  }
}
