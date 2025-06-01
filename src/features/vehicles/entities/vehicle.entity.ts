import { BaseEntity } from 'src/common/entities/base.model';
import { Entity, Column } from 'typeorm';

@Entity('vehicles')
export class Vehicle extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  plate: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  service?: string;
}
