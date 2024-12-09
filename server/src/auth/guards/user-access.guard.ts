import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ActiveUserData } from '../interfaces/activate-user-data.interface';

@Injectable()
export class UserAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: ActiveUserData = request['user'];
    if (Number(user.sub) !== Number(request.params.id)) {
      throw new ForbiddenException({
        description: 'You are not allowed to access this resource'
      });
    }
    return true;
  }
}
