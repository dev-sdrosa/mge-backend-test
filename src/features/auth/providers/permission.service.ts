import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { Permission } from '../entities/permission.entity';
import { CrudService } from 'src/features/crud/providers/crud.service';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';

@Injectable()
export class PermissionService extends CrudService<Permission> {
  constructor(private readonly permissionRepository: PermissionRepository) {
    super(permissionRepository.rp);
  }

  async new(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { name, description } = createPermissionDto;

    const existingPermission = await this.permissionRepository.rp.findOne({
      where: { name },
    });
    if (existingPermission) {
      throw new ConflictException(
        `Permission with name "${name}" already exists.`,
      );
    }

    const permission = this.permissionRepository.create({ name, description });
    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.rp.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found.`);
    }

    if (
      updatePermissionDto.name &&
      updatePermissionDto.name !== permission.name
    ) {
      const existing = await this.permissionRepository.rp.findOne({
        where: { name: updatePermissionDto.name },
      });
      if (existing && existing.id !== id)
        throw new ConflictException(
          `Permission name "${updatePermissionDto.name}" already in use.`,
        );
      permission.name = updatePermissionDto.name;
    }
    if (updatePermissionDto.description !== undefined)
      permission.description = updatePermissionDto.description;

    return this.permissionRepository.rp.save(permission);
  }
}
