import { IBaseEntity } from 'src/common/interfaces/base-entity.interface';

export interface IProject extends IBaseEntity {
  name: string;
  description?: string | null;
}
