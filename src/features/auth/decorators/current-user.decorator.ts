import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express-serve-static-core';
import { User } from 'src/features/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): User | undefined => {
    return context.switchToHttp().getRequest<Request>()?.user;
  },
);