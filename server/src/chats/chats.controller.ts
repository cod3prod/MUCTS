import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ChatsService } from './providers/chats.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { CreateChatDto } from './dtos/create-chat.dto';

@Auth(AuthType.Bearer)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @Auth(AuthType.None)
  async getAllChats() {
    const chats = await this.chatsService.getAllChats();
    return {
      status: 'ok',
      message: 'Chats found successfully',
      chats,
    };
  }

  @Get(':id')
  @Auth(AuthType.None)
  async getChatById(@Param('id', ParseIntPipe) id: number) {
    const chat = await this.chatsService.findChatById(id);
    return {
      status: 'ok',
      message: 'Chat found successfully',
      chat,
    };
  }

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto) {
    const chat = await this.chatsService.createChat(createChatDto);
    return {
      status: 'ok',
      message: 'Chat created successfully',
      chat,
    };
  }
}
