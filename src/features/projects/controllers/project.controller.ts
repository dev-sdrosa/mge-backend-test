import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../providers/project.service';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Project } from '../entities/project.entity';
import { AuthGuard } from 'src/features/auth/guards/auth.guard';
import { RolesGuard } from 'src/features/auth/guards/roles.guard';
import { RoleEnum } from 'src/features/auth/enums/role.enum';
import { Roles } from 'src/features/auth/decorators/roles.decorator';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The project has been successfully created.',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Project name already exists.',
  })
  @Roles(RoleEnum.ADMIN)
  create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectService.new(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all projects.',
    type: [Project],
  })
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The project.',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found.',
  })
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Project | null> {
    return this.projectService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The project has been successfully updated.',
    type: Project,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Project name already exists for another project.',
  })
  @Roles(RoleEnum.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The project has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found.',
  })
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.projectService.delete(id);
  }
}
