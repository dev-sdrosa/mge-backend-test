import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from '../entities/transfer.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class TransferRepository extends BaseRepository<Transfer> {
  constructor(
    @InjectRepository(Transfer) public readonly rp: Repository<Transfer>,
  ) {
    super(rp);
  }
}
