import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(
    @InjectRepository(Project) public readonly rp: Repository<Project>,
  ) {
    super(rp);
  }
}
