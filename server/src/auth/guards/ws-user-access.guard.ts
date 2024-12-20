import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsUserAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
    const user = client['user'];

    if (Number(user.sub) !== Number(data.createdById)) {
      throw new WsException({
        description: 'You are not allowed to access this resource',
      });
    }

    return true;
  }
}
