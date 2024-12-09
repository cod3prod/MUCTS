import { Injectable } from '@nestjs/common';
import { LogInDto } from '../dtos/log-in.dto';
import { LogInProvider } from './log-in-provider';
import { RefreshTokensProvider } from './refresh-tokens.providers';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logInProvider: LogInProvider,
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  public async logIn(logInDto: LogInDto) {
    return this.logInProvider.logIn(logInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
