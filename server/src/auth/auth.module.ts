import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { LogInProvider } from './providers/log-in-provider';
import { AuthController } from './auth.controller';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.providers';
import { UserAccessGuard } from './guards/user-access.guard';
import { WsAuthGuard } from './guards/ws-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    LogInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    UserAccessGuard,
    WsAuthGuard,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [
    AuthService, 
    HashingProvider, 
    UserAccessGuard, 
    WsAuthGuard,
  ],
})
export class AuthModule {}
