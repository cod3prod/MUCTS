import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsUserAccessGuard implements CanActivate {
  private readonly logger = new Logger(WsUserAccessGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
    const user = client['user'];

    this.logger.debug(`User ID: ${user.sub}, Created By ID: ${data.createdById}`); 

    if (Number(user.sub) !== Number(data.createdById)) {
      this.logger.warn(`Access denied for User ID: ${user.sub}`); 
      throw new WsException({
        description: 'You are not allowed to access this resource',
      });
    }

    this.logger.log(`Access granted for User ID: ${user.sub}`);
    return true;
  }
}