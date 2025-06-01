import { IUser } from 'src/features/users/interfaces/user.interface';

export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}