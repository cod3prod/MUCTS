import { SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './providers/chats.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { PatchChatDto } from './dtos/patch-chat.dto';
import { CreateMessageDto } from 'src/messages/dtos/create-message.dto';
import { UseGuards, Logger } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { WsUserAccessGuard } from 'src/auth/guards/ws-user-access.guard';

@Auth(AuthType.Bearer)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsAuthGuard)
export class ChatsGateway {
  private readonly logger = new Logger(ChatsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

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
        event: 'joinChat'
      });
      throw error;
    }
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; chatId: number },
  ) {
    try {
      const result = await this.chatsService.leaveChat(data.userId, data.chatId);
      client.leave(`chat_${data.chatId}`);
      this.server.to(`chat_${data.chatId}`).emit('userLeft', result);
      return result;
    } catch (error) {
      client.emit('error', {
        message: error.message,
        event: 'leaveChat'
      });
      throw error;
    }
  }

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
      this.server.to(`chat_${createMessageDto.chatId}`).emit('newMessage', message);
      return message;
    } catch (error) {
      client.emit('error', {
        message: error.message,
        event: 'sendMessage'
      });
      throw error;
    }
  }

  @UseGuards(WsUserAccessGuard)
  @SubscribeMessage('patchChat')
  async handlePatchChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: number; patchChatDto: PatchChatDto },
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
        event: 'patchChat'
      });
      throw error;
    }
  }

  @UseGuards(WsUserAccessGuard)
  @SubscribeMessage('deleteChat')
  async handleDeleteChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: number; createdById: number },
  ) {
    try {
      const result = await this.chatsService.deleteChat(data.id, data.createdById);
      this.server.to(`chat_${data.id}`).emit('chatDeleted', result);
      return result;
    } catch (error) {
      client.emit('error', {
        message: error.message,
        event: 'deleteChat'
      });
      throw error;
    }
  }
}
