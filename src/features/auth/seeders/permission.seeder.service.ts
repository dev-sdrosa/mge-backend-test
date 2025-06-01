import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { PERMISSIONS_DEFINITIONS } from '../constants/permissions.constants';

@Injectable()
export class PermissionSeederService {
  private readonly logger = new Logger(PermissionSeederService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    this.logger.log('Starting to seed permissions...');

    for (const permissionDef of PERMISSIONS_DEFINITIONS) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: permissionDef.name },
      });

      if (!existingPermission) {
        const newPermission = this.permissionRepository.create({
          name: permissionDef.name,
          description: permissionDef.description,
        });
        await this.permissionRepository.save(newPermission);
        this.logger.log(`Permission "${permissionDef.name}" created.`);
      } else {
        if (existingPermission.description !== permissionDef.description) {
          existingPermission.description = permissionDef.description;
          await this.permissionRepository.save(existingPermission);
          this.logger.log(
            `Permission "${permissionDef.name}" description updated.`,
          );
        } else {
          this.logger.log(`Permission "${permissionDef.name}" already exists.`);
        }
      }
    }
    this.logger.log('Permissions seeding finished.');
  }
}
