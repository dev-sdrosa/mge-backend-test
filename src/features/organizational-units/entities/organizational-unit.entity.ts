import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.model';

@Entity('organizational_units')
export class OrganizationalUnit extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => Project, (project) => project.organizationalUnits, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  project_id: number;

  @ManyToMany(() => User, (user) => user.organizationalUnits)
  @JoinTable({
    name: 'user_organizational_units',
    joinColumn: { name: 'organizational_unit_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
