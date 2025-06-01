import { IBaseEntity } from 'src/common/interfaces/base-entity.interface';
import { IRole } from './role.interface';

export interface IPermission extends IBaseEntity {
  name: string;
  description?: string | null;
  roles?: IRole[];
}
