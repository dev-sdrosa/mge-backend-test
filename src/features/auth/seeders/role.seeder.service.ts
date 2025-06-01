import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RoleEnum } from '../enums/role.enum';

interface RoleSeedData {
  name: RoleEnum;
  description: string;
  permissionNames: string[];
}

@Injectable()
export class RoleSeederService {
  private readonly logger = new Logger(RoleSeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    const rolesToSeed: RoleSeedData[] = [
      {
        name: RoleEnum.ADMIN,
        description: 'Administrador del sistema con acceso total.',
        permissionNames: ['system_admin'],
      },
      {
        name: RoleEnum.USER,
        description: 'Usuario estándar de la aplicación.',
        permissionNames: [
          'profile:view',
          'view_transfers',
          'create_transfer',
          'edit_transfer',
          'delete_transfer',
        ],
      },
    ];

    this.logger.log('Starting to seed roles...');

    for (const roleData of rolesToSeed) {
      let role = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['permissions'],
      });

      const permissions: Permission[] = [];
      for (const pName of roleData.permissionNames) {
        const permission = await this.permissionRepository.findOne({
          where: { name: pName },
        });
        if (permission) {
          permissions.push(permission);
        } else {
          this.logger.warn(
            `Permission "${pName}" not found for role "${roleData.name}". Skipping.`,
          );
        }
      }

      if (!role) {
        role = this.roleRepository.create({
          name: roleData.name,
          description: roleData.description,
          permissions: permissions,
        });
        let updated = false;
        if (role.description !== roleData.description) {
          role.description = roleData.description;
          updated = true;
        }
        role.permissions = permissions;
        await this.roleRepository.save(role);
        this.logger.log(
          `Role "${roleData.name}" ${updated ? 'description updated and ' : ''}permissions (re)assigned.`,
        );
      }
    }
    this.logger.log('Roles seeding finished.');
  }
}
