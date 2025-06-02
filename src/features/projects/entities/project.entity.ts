import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { OrganizationalUnit } from '../../organizational-units/entities/organizational-unit.entity';
import { BaseEntity } from 'src/common/entities/base.model';
import { User } from 'src/features/users/entities/user.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(
    () => OrganizationalUnit,
    (organizationalUnit) => organizationalUnit.project,
  )
  organizationalUnits: OrganizationalUnit[];

  @ManyToMany(() => User, (user) => user.projects)
  users: User[];
}
