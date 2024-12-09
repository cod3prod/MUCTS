import { SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './providers/chats.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { PatchChatDto } from './dtos/patch-chat.dto';
import { CreateMessageDto } from 'src/messages/dtos/create-message.dto';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';


@Auth(AuthType.Bearer)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsAuthGuard)
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; chatId: number },
  ) {
    const result = await this.chatsService.joinChat(data.userId, data.chatId);
    client.join(`chat_${data.chatId}`);
    this.server.to(`chat_${data.chatId}`).emit('userJoined', result);
    return result;
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; chatId: number },
  ) {
    const result = await this.chatsService.leaveChat(data.userId, data.chatId);
    client.leave(`chat_${data.chatId}`);
    this.server.to(`chat_${data.chatId}`).emit('userLeft', result);
    return result;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const message = await this.chatsService.addMessageToChat(
      createMessageDto.chatId,
      createMessageDto,
    );
    this.server.to(`chat_${createMessageDto.chatId}`).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('patchChat')
  async handlePatchChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: number; patchChatDto: PatchChatDto },
  ) {
    const updatedChat = await this.chatsService.patchChat(
      data.id,
      data.patchChatDto,
    );
    this.server.to(`chat_${data.id}`).emit('chatUpdated', updatedChat);
    return updatedChat;
  }

  @SubscribeMessage('deleteChat')
  async handleDeleteChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: number; createdById: number },
  ) {
    const result = await this.chatsService.deleteChat(data.id, data.createdById);
    this.server.to(`chat_${data.id}`).emit('chatDeleted', result);
    return result;
  }
}
