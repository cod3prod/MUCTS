import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/activate-user-data.interface';
import { UserAccessGuard } from 'src/auth/guards/user-access.guard';

@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return {
      status: 'ok',
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Get('me')
  async getCurrentUser(@ActiveUser() activeUser: ActiveUserData) {
    const user = await this.usersService.findUserById(activeUser.sub);
    return {
      status: 'ok',
      message: 'User found successfully',
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Get(':id')
  @UseGuards(UserAccessGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findUserById(id);
    return {
      status: 'ok',
      message: 'User found successfully',
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Patch(':id')
  @UseGuards(UserAccessGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
  ) {
    const user = await this.usersService.patchUser(id, patchUserDto);
    return {
      status: 'ok',
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Delete(':id')
  @UseGuards(UserAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deleteUser(id);
    return {
      status: 'ok',
      message: 'User deleted successfully',
    };
  }
}
