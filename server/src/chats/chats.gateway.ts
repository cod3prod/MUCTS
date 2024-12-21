import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './providers/chats.service';
import { PatchChatDto } from './dtos/patch-chat.dto';
import { CreateMessageDto } from 'src/messages/dtos/create-message.dto';
import { UseGuards, Logger } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { WsUserAccessGuard } from 'src/auth/guards/ws-user-access.guard';
import { AuthService } from 'src/auth/providers/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway {
  private readonly logger = new Logger(ChatsGateway.name);
  
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; chatId: number },
  ) {
    try {
      this.logger.debug(`joinChat 이벤트 수신: ${JSON.stringify(data)}`);
      const result = await this.chatsService.joinChat(data.userId, data.chatId);
      this.logger.debug(`joinChat 처리 결과: ${JSON.stringify(result)}`);
      client.join(`chat_${data.chatId}`);
      this.server.to(`chat_${data.chatId}`).emit('userJoined', result);
      return result;
    } catch (error) {
      this.logger.error(`joinChat 에러: ${error.message}`);
      client.emit('error', {
        message: error.message,
        event: 'joinChat',
      });
      throw error;
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; chatId: number },
  ) {
    try {
      const result = await this.chatsService.leaveChat(
        data.userId,
        data.chatId,
      );
      client.leave(`chat_${data.chatId}`);
      this.server.to(`chat_${data.chatId}`).emit('userLeft', result);
      return result;
    } catch (error) {
      client.emit('error', {
        message: error.message,
        event: 'leaveChat',
      });
      throw error;
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      const message = await this.chatsService.addMessageToChat(
        createMessageDto.chatId,
        createMessageDto,
      );
      this.server
        .to(`chat_${createMessageDto.chatId}`)
        .emit('newMessage', message);
      return message;
    } catch (error) {
      client.emit('error', {
        message: error.message,
        event: 'sendMessage',
      });
      throw error;
    }
  }

  @UseGuards(WsAuthGuard)
  @UseGuards(WsUserAccessGuard)
  @SubscribeMessage('patchChat')
  async handlePatchChat(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { id: number; createdById: number; patchChatDto: PatchChatDto },
  ) {
    try {
      const updatedChat = await this.chatsService.patchChat(
        data.id,
        data.patchChatDto,
      );
      this.server.to(`chat_${data.id}`).emit('chatUpdated', updatedChat);
      return updatedChat;
    } catch (error) {
      client.emit('error', {
        message: error.message,
        event: 'patchChat',
      });
      throw error;
    }
  }

  @UseGuards(WsAuthGuard)
  @UseGuards(WsUserAccessGuard)
  @SubscribeMessage('deleteChat')
  async handleDeleteChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: number; createdById: number },
  ) {
    try {
      await this.chatsService.deleteChat(data.id, data.createdById);
      this.server.to(`chat_${data.id}`).emit('chatDeleted');
      return true;
    } catch (error) {
      client.emit('error', {
        message: error.message,
        event: 'deleteChat',
      });
      throw error;
    }
  }

  @SubscribeMessage('refreshToken')
  async handleRefreshToken(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { refreshToken: string },
  ) {
    try {
      const tokens = await this.authService.refreshTokens({
        refreshToken: data.refreshToken,
      });
      client.emit('newTokens', tokens);
      return tokens;
    } catch (error) {
      client.emit('error', {
        message: error.message,
        event: 'refreshToken',
      });
      throw error;
    }
  }
}
