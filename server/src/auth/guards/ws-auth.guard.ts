import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const authToken = client.handshake.headers.authorization?.split(' ')[1];
      
      if (!authToken) {
        throw new WsException('Unauthorized access');
      }

      const payload = await this.jwtService.verifyAsync(authToken);
      client['user'] = payload;
      
      return true;
    } catch {
      throw new WsException('Invalid credentials');
    }
  }
}