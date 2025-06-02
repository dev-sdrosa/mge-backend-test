import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.model';
import { User } from 'src/features/users/entities/user.entity';
import { Vehicle } from 'src/features/vehicles/entities/vehicle.entity';
import { Project } from 'src/features/projects/entities/project.entity';
import { OrganizationalUnit } from 'src/features/organizational-units/entities/organizational-unit.entity';

export enum TransferType {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  INTERNAL = 'internal',
}

@Entity('transfers')
export class Transfer extends BaseEntity {
  @Column({ type: 'enum', enum: TransferType, default: TransferType.INBOUND })
  type: TransferType;

  @ManyToOne(() => Vehicle, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column()
  vehicle_id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'client_id' })
  client?: User;

  @Column({ nullable: true })
  client_id?: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'transmitter_id' })
  transmitter: User;

  @Column()
  transmitter_id: number;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ nullable: true })
  project_id?: number;

  @ManyToOne(() => OrganizationalUnit, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'organizational_unit_id' })
  organizationalUnit?: OrganizationalUnit;

  @Column({ nullable: true })
  organizational_unit_id?: number;

  @Column({
    type: 'timestamp',
    name: 'transfer_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transferDate: Date;
}
