import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.model';
import { Role } from 'src/features/auth/entities/role.entity';
import { Project } from 'src/features/projects/entities/project.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password_hash: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: false, cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles?: Role[];

  @ManyToMany(() => Project, (project) => project.users)
  projects: Project[];
}
