import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './providers/chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import { PatchChatProvider } from './providers/patch-chat.provider';
import { DeleteChatProvider } from './providers/delete-chat.provider';
import { ChatParticipationProvider } from './providers/chat-participation.provider';
import { FindChatProvider } from './providers/find-chat.provider';
import { CreateChatProvider } from './providers/create-chat.provider';
import { ChatsController } from './chats.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsGateway } from './chats.gateway';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]), 
    MessagesModule, 
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    ChatsService,
    PatchChatProvider,
    DeleteChatProvider,
    FindChatProvider,
    ChatParticipationProvider,
    CreateChatProvider,
    ChatsGateway,
  ],
  exports: [
    ChatsService,
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}

