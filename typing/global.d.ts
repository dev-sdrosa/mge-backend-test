// import { Payload } from '../src/auth';

export declare global {
  type AnyObject = Record<string, unknown>;

  namespace Express {
    interface Request {
      user: number;
    }
  }
}
