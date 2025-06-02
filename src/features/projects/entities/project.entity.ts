import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.model';
import { User } from 'src/features/users/entities/user.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.projects)
  users: User[];
}
