import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { PatchUserProvider } from './patch-user.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly createUserProvider: CreateUserProvider,
    private readonly patchUserProvider: PatchUserProvider,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  async findUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['chat'],
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        chat: { id: true, title: true, createdAt: true },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async patchUser(id: number, patchUserDto: PatchUserDto) {
    return this.patchUserProvider.patchUser(id, patchUserDto);
  }

  async deleteUser(id: number) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
