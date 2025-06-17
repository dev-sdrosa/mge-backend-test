import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) public rp: Repository<User>) {
    super(rp);
  }

  public async findByIdWithRolesAndPermissions(
    id: number,
  ): Promise<User | null> {
    return this.rp.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }

  public async findByIdWithProjectsAndOUs(
    id: number,
  ): Promise<User | null> {
    return this.rp.findOne({
      where: { id },
      relations: ['projects', 'organizationalUnits'],
    });
  }
}
