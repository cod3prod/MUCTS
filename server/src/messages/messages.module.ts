import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessagesService } from './providers/messages.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/user.entity';
import { Chat } from 'src/chats/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Chat]),
    UsersModule
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
