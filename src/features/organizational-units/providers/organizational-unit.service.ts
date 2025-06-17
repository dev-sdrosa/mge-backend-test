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
import { UserRepository } from 'src/features/users/repositories/user.repository';
import { In } from 'typeorm';

@Injectable()
export class OrganizationalUnitService extends CrudService<OrganizationalUnit> {
  constructor(
    private readonly organizationalUnitRepository: OrganizationalUnitRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(organizationalUnitRepository.rp);
  }

  async new(
    createDto: CreateOrganizationalUnitDto,
  ): Promise<OrganizationalUnit> {
    const { name, project_id, userIds } = createDto;

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

    const ouData: Partial<OrganizationalUnit> = {
      name,
      project_id,
    };

    if (userIds && userIds.length > 0) {
      const users = await this.userRepository.rp.findBy({ id: In(userIds) });
      if (users.length !== userIds.length) {
        const foundUserIds = users.map((u) => u.id);
        const notFoundUserIds = userIds.filter(
          (id) => !foundUserIds.includes(id),
        );
        throw new BadRequestException(
          `Users with the following IDs were not found: ${notFoundUserIds.join(', ')}`,
        );
      }
      ouData.users = users;
    } else {
      ouData.users = [];
    }
    return this.organizationalUnitRepository.create(ouData);
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

    const { name, project_id, userIds } = updateDto;

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

    if (project_id && project_id !== unit.project_id) {
      const projectExists = await this.projectRepository.exists(project_id);
      if (!projectExists) {
        throw new BadRequestException(
          `Project with ID "${project_id}" not found. Cannot change OU to a non-existent project.`,
        );
      }
      const existingUnitInNewProject =
        await this.organizationalUnitRepository.rp.findOne({
          where: { name: unit.name, project_id: project_id },
        });
      if (existingUnitInNewProject && existingUnitInNewProject.id !== id) {
        throw new ConflictException(
          `Organizational unit with name "${unit.name}" already exists in project ID ${project_id}.`,
        );
      }
      unit.project_id = project_id;
    }

    if (userIds !== undefined) {
      if (userIds.length > 0) {
        const users = await this.userRepository.rp.findBy({ id: In(userIds) });
        if (users.length !== userIds.length) {
          const foundUserIds = users.map((u) => u.id);
          const notFoundUserIds = userIds.filter(
            (id) => !foundUserIds.includes(id),
          );
          throw new BadRequestException(
            `Users with the following IDs were not found: ${notFoundUserIds.join(', ')}`,
          );
        }
        unit.users = users;
      } else {
        unit.users = [];
      }
    }
    return this.organizationalUnitRepository.rp.save(unit);
  }
}
