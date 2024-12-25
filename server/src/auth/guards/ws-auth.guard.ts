import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ErrorMessage } from 'src/common/interfaces/error-message.interface';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    try {
      const authToken = client.handshake.auth.token;
      // this.logger.debug('Auth:', client.handshake.auth);

      if (!authToken) {
        throw new WsException({ description: 'Authorization token not found' });
      }

      const payload = await this.jwtService.verifyAsync(authToken);
      client['user'] = payload;
      this.logger.log(`Token verified successfully, User ID: ${payload.sub} `);
      return true;
    } catch (error) {
      if (error.message === 'jwt expired') {
        client.emit('tokenExpired');
        return false;
      }
      this.logger.error('Auth error:', error.message);
      const errorMessage: ErrorMessage = {
        description: error.message || 'Invalid credentials',
        statusCode: 401,
      };
      throw new WsException(errorMessage);
    }
  }
}
