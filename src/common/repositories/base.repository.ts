import { BaseEntity } from 'src/common/entities/base.model';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async exists(id: number): Promise<boolean> {
    const entity = await this.repository.exists({
      where: {
        id: id,
      } as FindOptionsWhere<T>,
    });
    return entity !== null;
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<T> {
    const findOptions: FindOneOptions<T> = {
      where: {
        id: id,
      } as FindOptionsWhere<T>,
    };

    return this.repository.findOne(findOptions);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
