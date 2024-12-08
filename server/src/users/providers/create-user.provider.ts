import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser;
    try {
      existingUser = await this.usersRepository.findOne({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }

    return newUser;
  }
}
