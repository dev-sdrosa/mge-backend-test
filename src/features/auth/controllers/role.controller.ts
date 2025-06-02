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
import { RoleService } from '../providers/role.service';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from '../entities/role.entity';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { RoleEnum } from '../enums/role.enum';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The role has been successfully created.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Role name already exists.',
  })
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.new(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all roles.',
    type: [Role],
  })
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The role.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Role | null> {
    return this.roleService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The role has been successfully updated.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Role name already exists for another role.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The role has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found.',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.roleService.delete(id);
  }
}
