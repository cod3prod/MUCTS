import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly logger = new Logger(AccessTokenGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // this.logger.debug('Extracted token: ' + token);

    if (!token) {
      this.logger.warn('Authorization token not found');
      throw new UnauthorizedException({
        description: 'Authorization token not found'
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request['user'] = payload;
      this.logger.log(`Token verified successfully, User ID: ${payload.sub} `);
    } catch (error) {
      this.logger.error('Token verification failed: ' + error.message);
      throw new UnauthorizedException({
        description: error.message || 'Invalid token'
      });
    }
    return true;
  }
}