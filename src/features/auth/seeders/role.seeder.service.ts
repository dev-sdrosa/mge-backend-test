import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RoleEnum } from '../enums/role.enum';
import { PermissionEnum } from '../enums/permission.enum';

interface RoleSeedData {
  name: RoleEnum;
  description: string;
  permissionNames: PermissionEnum[];
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
        permissionNames: [PermissionEnum.SYSTEM_ADMIN],
      },
      {
        name: RoleEnum.USER,
        description: 'Usuario estándar de la aplicación.',
        permissionNames: [
          PermissionEnum.PROFILE_VIEW,
          PermissionEnum.TRANSFERS_READ,
          PermissionEnum.TRANSFERS_CREATE,
          PermissionEnum.TRANSFERS_UPDATE,
          PermissionEnum.TRANSFERS_DELETE,
          // Permisos de lectura para otros recursos (ejemplo)
          PermissionEnum.PROJECTS_READ,
          PermissionEnum.PROJECTS_CREATE,
          PermissionEnum.PROJECTS_UPDATE,
          PermissionEnum.VEHICLES_READ,
          PermissionEnum.ORGANIZATIONALUNITS_READ,
          PermissionEnum.ORGANIZATIONALUNITS_CREATE,
          PermissionEnum.ORGANIZATIONALUNITS_UPDATE,
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
      if (roleData.permissionNames && roleData.permissionNames.length > 0) {
        for (const pName of roleData.permissionNames) {
          const permission = await this.permissionRepository.findOne({
            where: { name: pName },
          });
          if (permission) {
            permissions.push(permission);
          } else {
            this.logger.warn(
              `Permission "${pName}" not found for role "${roleData.name}". Skipping assignment. Ensure it's seeded by PermissionSeederService.`,
            );
          }
        }
      }

      if (!role) {
        role = this.roleRepository.create({
          name: roleData.name,
          description: roleData.description,
          permissions: permissions,
        });
        await this.roleRepository.save(role);
        this.logger.log(`Role "${roleData.name}" created with assigned permissions.`);
      } else {
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
