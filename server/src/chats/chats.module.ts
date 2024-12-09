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

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]), 
    MessagesModule, 
    UsersModule
  ],
  providers: [
    ChatsService,
    PatchChatProvider,
    DeleteChatProvider,
    FindChatProvider,
    ChatParticipationProvider,
    CreateChatProvider,
  ],
  exports: [
    ChatsService,
  ],
})
export class ChatsModule {}

