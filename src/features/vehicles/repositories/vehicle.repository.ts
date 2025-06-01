import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class VehicleRepository extends BaseRepository<Vehicle> {
  constructor(
    @InjectRepository(Vehicle) public readonly rp: Repository<Vehicle>,
  ) {
    super(rp);
  }
}
