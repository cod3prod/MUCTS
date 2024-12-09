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
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/activate-user-data.interface';

@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('me')
  async getCurrentUser(@ActiveUser() activeUser: ActiveUserData) {
    return this.usersService.findUserById(activeUser.sub);
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    if (id !== activeUser.sub) {
      throw new UnauthorizedException('Cannot view other users information');
    }
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    if (id !== activeUser.sub) {
      throw new UnauthorizedException('Cannot update other users');
    }
    return this.usersService.patchUser(id, patchUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    if (id !== activeUser.sub) {
      throw new UnauthorizedException('Cannot delete other users');
    }
    await this.usersService.deleteUser(id);
  }
}
