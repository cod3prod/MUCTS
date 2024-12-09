import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ErrorMessage } from 'src/common/interfaces/error-message.interface';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const authToken = client.handshake.headers.authorization?.split(' ')[1];
      
      if (!authToken) {
        throw new WsException({ description: 'Authorization token not found' });
      }

      const payload = await this.jwtService.verifyAsync(authToken);
      client['user'] = payload;
      
      return true;
    } catch (error) {
      const errorMessage: ErrorMessage = {
        description: error.message || 'Invalid credentials',
        statusCode: 401
      };
      throw new WsException(errorMessage);
    }
  }
}