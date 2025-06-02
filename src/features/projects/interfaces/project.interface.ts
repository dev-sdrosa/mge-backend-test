import { IOrganizationalUnit } from 'src/features/organizational-units/interfaces/organizational-unit.interface';
import { IBaseEntity } from 'src/common/interfaces/base-entity.interface';

export interface IProject extends IBaseEntity {
  name: string;
  description?: string | null;

  organizationalUnits?: IOrganizationalUnit[];
}
