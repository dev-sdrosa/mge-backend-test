import { Request as ExpressRequest } from 'express';
import { User } from 'src/features/users/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request extends ExpressRequest {
    user?: User;
  }
}