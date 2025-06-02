import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalUnit } from './entities/organizational-unit.entity';
import { OrganizationalUnitController } from './controllers/organizational-unit.controller';
import { OrganizationalUnitService } from './providers/organizational-unit.service';
import { OrganizationalUnitRepository } from './repositories/organizational-unit.repository';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationalUnit]), ProjectsModule],
  controllers: [OrganizationalUnitController],
  providers: [OrganizationalUnitService, OrganizationalUnitRepository],
  exports: [OrganizationalUnitService, OrganizationalUnitRepository],
})
export class OrganizationalUnitsModule {}
