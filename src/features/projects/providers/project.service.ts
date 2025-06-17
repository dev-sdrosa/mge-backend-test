import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../entities/project.entity';
import { CrudService } from 'src/features/crud/providers/crud.service';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { In } from 'typeorm';
import { UserRepository } from 'src/features/users/repositories/user.repository';
import { User } from 'src/features/users/entities/user.entity';

@Injectable()
export class ProjectService extends CrudService<Project> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(projectRepository.rp);
  }

  async new(createProjectDto: CreateProjectDto): Promise<Project> {
    const { name, description, userIds } = createProjectDto;

    const existingProject = await this.projectRepository.rp.findOne({
      where: { name },
    });
    if (existingProject) {
      throw new ConflictException(
        `Project with name "${name}" already exists.`,
      );
    }

    const projectData: Partial<Project> = {
      name,
      description,
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
      projectData.users = users;
    } else {
      projectData.users = [];
    }

    return this.projectRepository.create(projectData);
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }

    const { name, description, userIds } = updateProjectDto;

    if (name && name !== project.name) {
      const existingProjectWithNewName =
        await this.projectRepository.rp.findOne({
          where: { name },
        });
      if (existingProjectWithNewName && existingProjectWithNewName.id !== id) {
        throw new ConflictException(
          `Project with name "${name}" already exists.`,
        );
      }
      project.name = name;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (userIds !== undefined) {
      if (userIds.length > 0) {
        const users = await this.userRepository.rp.findBy({
          id: In(userIds),
        });
        project.users = users;
      } else {
        project.users = [];
      }
    }

    return this.projectRepository.rp.save(project);
  }
}
