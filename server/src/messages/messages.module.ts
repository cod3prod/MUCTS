import { Module } from '@nestjs/common';
import { MessagesService } from './providers/messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UsersModule],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
