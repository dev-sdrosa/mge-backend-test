import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationalUnit } from '../entities/organizational-unit.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class OrganizationalUnitRepository extends BaseRepository<OrganizationalUnit> {
  constructor(
    @InjectRepository(OrganizationalUnit)
    public readonly rp: Repository<OrganizationalUnit>,
  ) {
    super(rp);
  }
}
