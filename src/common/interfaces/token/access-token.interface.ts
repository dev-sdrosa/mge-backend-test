import { IRole } from 'src/features/auth/interfaces/role.interface';
import { ITokenBase } from './token-base.interface';

export interface IAccessPayload {
  id: number;
  roles: string[];
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}
