import { IBaseEntity } from 'src/common/interfaces/base-entity.interface';
import { IPermission } from './permission.interface';

export interface IRole extends IBaseEntity {
  name: string;
  description?: string | null;
  permissions?: IPermission[];
}
