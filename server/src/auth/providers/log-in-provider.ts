import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { LogInDto } from '../dtos/log-in.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class LogInProvider {
  private logger = new Logger(LogInProvider.name)
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider
  ) { }

  public async logIn(logInDto: LogInDto) {
    const user = await this.usersService.findByUsername(logInDto.username);

    if (!user) {
      throw new UnauthorizedException({
        description: 'User not found'
      });
    }

    let isEqual;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        logInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException({
        description: 'Could not compare the password'
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException({
        description: 'Invalid credentials'
      });
    }

    const tokens = await this.generateTokensProvider.generateTokens(user);
    const result = {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      }
    }

    this.logger.log(`User ${user.username} logged in successfully`);
    
    return result;
  }
}
