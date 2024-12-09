import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "../chat.entity";
import { IsNull, Repository } from "typeorm";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class FindChatProvider {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

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
}