import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { DataSource } from "typeorm";
import { Chat } from "../chat.entity";
import { User } from "src/users/user.entity";

@Injectable()
export class ChatParticipationProvider {
  constructor(private readonly dataSource: DataSource) {}

  async joinChat(userId: number, chatId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      const userRepo = manager.getRepository(User);

      const chat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants'],
        select: {
          id: true,
          title: true,
          createdAt: true,
          createdBy: { 
            id: true, 
            username: true, 
            nickname: true 
          },
          participants: {
            id: true,
            username: true,
            nickname: true
          }
        }
      });

      if (!chat) {
        throw new WsException('채팅방을 찾을 수 없습니다');
      }

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['chat']
      });

      if (!user) {
        throw new WsException('사용자를 찾을 수 없습니다');
      }

      if (user.chat && user.chat.id !== chatId) {
        throw new WsException('이미 다른 채팅방에 참여 중입니다');
      }

      if (user.chat && user.chat.id === chatId) {
        return chat;
      }

      user.chat = chat;
      await userRepo.save(user);

      const updatedChat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants'],
        select: {
          id: true,
          title: true,
          createdAt: true,
          createdBy: { 
            id: true, 
            username: true, 
            nickname: true 
          },
          participants: {
            id: true,
            username: true,
            nickname: true
          }
        }
      });

      return updatedChat;
    });
  }

  async leaveChat(userId: number, chatId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const chatRepo = manager.getRepository(Chat);
      const userRepo = manager.getRepository(User);

      const chat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants']
      });

      if (!chat) {
        throw new WsException('채팅방을 찾을 수 없습니다');
      }

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['chat']
      });

      if (!user) {
        throw new WsException('사용자를 찾을 수 없습니다');
      }

      // 방장이 나가면 채팅방 비활성화
      if (chat.createdBy.id === userId) {
        await chatRepo.delete(chatId);
        
        await userRepo
          .createQueryBuilder()
          .update(User)
          .set({ chat: null })
          .where('chat.id = :chatId', { chatId })
          .execute();

        // 비활성화된 채팅방 정보를 다시 조회
        const deletedChat = await chatRepo
          .createQueryBuilder('chat')
          .withDeleted()
          .leftJoinAndSelect('chat.createdBy', 'createdBy')
          .leftJoinAndSelect('chat.participants', 'participants')
          .where('chat.id = :id', { id: chatId })
          .getOne();

        return deletedChat;
      }

      // 일반 참여자 퇴장
      user.chat = null;
      await userRepo.save(user);

      // 업데이트된 채팅방 정보를 다시 조회
      const updatedChat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ['createdBy', 'participants']
      });

      return updatedChat;
    });
  }
}