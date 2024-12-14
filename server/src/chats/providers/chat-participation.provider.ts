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

      // 이미 다른 채팅방에 참여 중인 경우
      if (user.chat && user.chat.id !== chatId) {
        throw new WsException('이미 다른 채팅방에 참여 중입니다');
      }

      // 이미 해당 채팅방에 참여 중인 경우
      if (user.chat && user.chat.id === chatId) {
        throw new WsException('이미 참여 중인 채팅방입니다');
      }

      user.chat = chat;
      await userRepo.save(user);

      return chat;
    });
  }

  async leaveChat(userId: number, chatId: number) {
    return await this.dataSource. transaction(async (manager) => {
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
        await chatRepo.softDelete(chatId);
        
        // 모든 참여자 퇴장
        await userRepo
          .createQueryBuilder()
          .update(User)
          .set({ chat: null })
          .where('chat.id = :chatId', { chatId })
          .execute();

        return {
          type: 'deactivate',
          chatId,
          userId
        };
      }

      // 일반 참여자 퇴장
      user.chat = null;
      await userRepo.save(user);

      return {
        type: 'leave',
        chatId,
        userId
      };
    });
  }
}