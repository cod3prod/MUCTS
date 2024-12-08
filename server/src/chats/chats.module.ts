import { Module } from '@nestjs/common';
import { ChatsService } from './providers/chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), MessagesModule, UsersModule],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}

