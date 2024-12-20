import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ErrorMessage } from 'src/common/interfaces/error-message.interface';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);
  
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      
      // 디버깅을 위한 로그
      this.logger.debug('Auth:', client.handshake.auth);
      const authToken = client.handshake.auth.token;

      if (!authToken) {
        throw new WsException({ description: 'Authorization token not found' });
      }

      const payload = await this.jwtService.verifyAsync(authToken);
      client['user'] = payload;
      
      return true;
    } catch (error) {
      this.logger.error('Auth error:', error);
      const errorMessage: ErrorMessage = {
        description: error.message || 'Invalid credentials',
        statusCode: 401
      };
      throw new WsException(errorMessage);
    }
  }
}