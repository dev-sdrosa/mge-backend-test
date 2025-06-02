import { IBaseEntity } from 'src/common/interfaces/base-entity.interface';
import { IProject } from 'src/features/projects/interfaces/project.interface';
import { IUser } from 'src/features/users/interfaces/user.interface';

export interface IOrganizationalUnit extends IBaseEntity {
  name: string;
  project?: IProject;
  users?: IUser[];
}
