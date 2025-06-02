import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { OrganizationalUnitRepository } from '../repositories/organizational-unit.repository';
import { OrganizationalUnit } from '../entities/organizational-unit.entity';
import { CrudService } from 'src/features/crud/providers/crud.service';
import { CreateOrganizationalUnitDto } from '../dtos/create-organizational-unit.dto';
import { UpdateOrganizationalUnitDto } from '../dtos/update-organizational-unit.dto';
import { ProjectRepository } from 'src/features/projects/repositories/project.repository';

@Injectable()
export class OrganizationalUnitService extends CrudService<OrganizationalUnit> {
  constructor(
    private readonly organizationalUnitRepository: OrganizationalUnitRepository,
    private readonly projectRepository: ProjectRepository,
  ) {
    super(organizationalUnitRepository.rp);
  }

  async new(
    createDto: CreateOrganizationalUnitDto,
  ): Promise<OrganizationalUnit> {
    const { name, project_id } = createDto;

    const project = await this.projectRepository.findById(project_id);
    if (!project) {
      throw new BadRequestException(
        `Project with ID "${project_id}" not found.`,
      );
    }

    const existingUnit = await this.organizationalUnitRepository.rp.findOne({
      where: { name, project_id },
    });
    if (existingUnit) {
      throw new ConflictException(
        `Organizational unit with name "${name}" already exists in this project.`,
      );
    }

    return this.organizationalUnitRepository.create({ name, project_id });
  }

  async update(
    id: number,
    updateDto: UpdateOrganizationalUnitDto,
  ): Promise<OrganizationalUnit> {
    const unit = await this.organizationalUnitRepository.findById(id);
    if (!unit) {
      throw new NotFoundException(
        `Organizational Unit with ID "${id}" not found.`,
      );
    }

    const { name } = updateDto;

    if (name && name !== unit.name) {
      const existingUnitWithNewName =
        await this.organizationalUnitRepository.rp.findOne({
          where: { name, project_id: unit.project_id },
        });
      if (existingUnitWithNewName && existingUnitWithNewName.id !== id) {
        throw new ConflictException(
          `Organizational unit with name "${name}" already exists in this project.`,
        );
      }
      unit.name = name;
    }

    return this.organizationalUnitRepository.rp.save(unit);
  }
}
