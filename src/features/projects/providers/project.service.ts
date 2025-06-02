import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../entities/project.entity';
import { CrudService } from 'src/features/crud/providers/crud.service';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';

@Injectable()
export class ProjectService extends CrudService<Project> {
  constructor(private readonly projectRepository: ProjectRepository) {
    super(projectRepository.rp);
  }

  async new(createProjectDto: CreateProjectDto): Promise<Project> {
    const { name, description } = createProjectDto;

    const existingProject = await this.projectRepository.rp.findOne({
      where: { name },
    });
    if (existingProject) {
      throw new ConflictException(
        `Project with name "${name}" already exists.`,
      );
    }

    return this.projectRepository.create({ name, description });
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found.`);
    }

    const { name, description } = updateProjectDto;

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

    return this.projectRepository.rp.save(project);
  }
}
