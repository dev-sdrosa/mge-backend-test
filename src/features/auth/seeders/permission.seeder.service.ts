import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { PermissionEnum } from '../enums/permission.enum';

const CRUD_RESOURCES_TO_SEED = [
  'transfers',
  'vehicles',
  'projects',
  'organizationalunits',
  'users',
  'roles',
  'permissions',
];

const CRUD_ACTIONS = ['create', 'read', 'update', 'delete'];

const SPECIAL_PERMISSIONS_TO_SEED = [
  { name: PermissionEnum.SYSTEM_ADMIN, description: 'Acceso total a todas las rutas y funcionalidades del sistema.' },
  { name: PermissionEnum.PROFILE_VIEW, description: 'Permite visualizar el perfil propio del usuario.' },
];

@Injectable()
export class PermissionSeederService {
  private readonly logger = new Logger(PermissionSeederService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  private async ensurePermissionExists(name: string, description: string) {
    const existingPermission = await this.permissionRepository.findOne({
      where: { name },
    });

    if (!existingPermission) {
      const newPermission = this.permissionRepository.create({
        name,
        description,
      });
      await this.permissionRepository.save(newPermission);
      this.logger.log(`Permission "${name}" created.`);
    } else {
      if (existingPermission.description !== description) {
        existingPermission.description = description;
        await this.permissionRepository.save(existingPermission);
        this.logger.log(`Permission "${name}" description updated.`);
      } else {
        this.logger.log(`Permission "${name}" already exists and is up to date.`);
      }
    }
  }

  async seed(): Promise<void> {
    this.logger.log('Starting to seed permissions...');

    // Seed CRUD permissions
    for (const resourceName of CRUD_RESOURCES_TO_SEED) {
      for (const action of CRUD_ACTIONS) {
        const permissionName = `${resourceName}:${action}`;
        const permissionDescription = `Permite la acción '${action}' sobre el recurso '${resourceName}'.`;
        await this.ensurePermissionExists(permissionName, permissionDescription);
      }
    }

    // Seed special permissions
    for (const specialPermission of SPECIAL_PERMISSIONS_TO_SEED) {
      await this.ensurePermissionExists(specialPermission.name, specialPermission.description);
    }

    this.logger.log('Permissions seeding finished.');
  }
}
