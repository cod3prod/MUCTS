import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ActiveUserData } from '../interfaces/activate-user-data.interface';

@Injectable()
export class UserAccessGuard implements CanActivate {
  private readonly logger = new Logger(UserAccessGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: ActiveUserData = request['user'];
    
    // this.logger.debug(`Request Params ID: ${request.params.id}`);
    // this.logger.debug(`Authenticated User ID: ${user.sub}`);
    
    if (Number(user.sub) !== Number(request.params.id)) {
      this.logger.warn(`Access denied for User ID: ${user.sub}`);
      throw new ForbiddenException({
        description: 'You are not allowed to access this resource',
      });
    }

    this.logger.log(`Access granted for User ID: ${user.sub}`);
    return true;
  }
}
