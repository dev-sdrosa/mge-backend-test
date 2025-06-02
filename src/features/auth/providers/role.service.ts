import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';
import { CrudService } from 'src/features/crud/providers/crud.service';
import { Permission } from '../entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleEnum } from '../enums/role.enum';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class RoleService extends CrudService<Role> {
  constructor(
    private readonly roleRepository: RoleRepository,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(roleRepository.rp);
  }

  public async new(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, description, permissionIds } = createRoleDto;

    const existingRole = await this.roleRepository.rp.findOne({
      where: { name },
    });
    if (existingRole) {
      throw new ConflictException(`Role with name "${name}" already exists.`);
    }

    let permissions: Permission[] = [];
    if (permissionIds && permissionIds.length > 0) {
      permissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      });
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('One or more permissions not found.');
      }
    }

    const role = this.roleRepository.create({
      name,
      description,
      permissions,
    });

    return role;
  }

  public async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.rp.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found.`);
    }

    const { name, description, permissionIds } = updateRoleDto;

    if (name && name !== role.name) {
      const existingRole = await this.roleRepository.rp.findOne({
        where: { name },
      });
      if (existingRole && existingRole.id !== id) {
        throw new ConflictException(`Role with name "${name}" already exists.`);
      }
      role.name = name;
    }

    if (description !== undefined) {
      role.description = description;
    }

    if (permissionIds) {
      role.permissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      });
    }

    return this.roleRepository.rp.save(role);
  }

  private async findByName(name: RoleEnum): Promise<Role> {
    const role = await this.roleRepository.rp.findOne({
      where: { name },
    });
    if (!role) {
      throw new NotFoundException(`Role with name "${name}" not found.`);
    }
    return role;
  }

  public async getRoleByName(name: RoleEnum): Promise<Role> {
    return this.findByName(name);
  }

  public async findOneById(
    id: number,
    relations: string[] = [],
  ): Promise<Role | null> {
    return this.roleRepository.rp.findOne({
      where: { id },
      relations: [...relations, 'permissions'],
    });
  }
}
