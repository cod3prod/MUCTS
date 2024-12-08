import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ActiveUserData } from '../interfaces/activate-user-data.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: ActiveUserData = request.user;

    return field ? user[field] : user;
  },
);

