import { Entity, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { BaseEntity } from 'src/common/entities/base.model';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
