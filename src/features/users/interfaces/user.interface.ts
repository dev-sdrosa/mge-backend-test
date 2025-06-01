import { IRole } from 'src/features/auth/interfaces/role.interface';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  roles?: IRole[];
  created_at: Date;
  updated_at: Date;
}
