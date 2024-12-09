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
    return this.usersService.createUser(createUserDto);
  }

  @Get('me')
  async getCurrentUser(@ActiveUser() activeUser: ActiveUserData) {
    return this.usersService.findUserById(activeUser.sub);
  }

  @Get(':id')
  @UseGuards(UserAccessGuard)
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @UseGuards(UserAccessGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
  ) {
    return this.usersService.patchUser(id, patchUserDto);
  }

  @Delete(':id')
  @UseGuards(UserAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.usersService.deleteUser(id);
  }
}
