import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { PatchUserDto } from '../dtos/patch-user.dto';

@Injectable()
export class PatchUserProvider {
  private logger = new Logger(PatchUserProvider.name)
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  async patchUser(userId: number, patchUserDto: PatchUserDto) {
    if (patchUserDto.password) {
      patchUserDto.password = await this.hashingProvider.hashPassword(
        patchUserDto.password,
      );
    }
    let user: User;
    try {
      user = await this.usersRepository.findOneBy({ id: userId });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = this.usersRepository.merge(user, patchUserDto);

    this.logger.log(`User updated successfully. User ID: ${userId}`);
    
    return await this.usersRepository.save(updatedUser);
  }
}
