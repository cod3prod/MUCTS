import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ChatsService } from './providers/chats.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { CreateChatDto } from './dtos/create-chat.dto';

@Auth(AuthType.Bearer)
@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService){}

    @Get()
    @Auth(AuthType.None)
    async getAllChats(){
        return this.chatsService.getAllChats();
    }

    @Get(':id')
    async getChatById(@Param('id', ParseIntPipe) id: number){
        return this.chatsService.findChatById(id);
    }

    @Post()
    async createChat(@Body() createChatDto: CreateChatDto){
        return this.chatsService.createChat(createChatDto);
    }
}
