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
} from '@nestjs/common';
import { OrganizationalUnitService } from '../providers/organizational-unit.service';
import { CreateOrganizationalUnitDto } from '../dtos/create-organizational-unit.dto';
import { UpdateOrganizationalUnitDto } from '../dtos/update-organizational-unit.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrganizationalUnit } from '../entities/organizational-unit.entity';

@ApiTags('Organizational Units')
@Controller('organizational-units')
export class OrganizationalUnitController {
  constructor(
    private readonly organizationalUnitService: OrganizationalUnitService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organizational unit' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The organizational unit has been successfully created.',
    type: OrganizationalUnit,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid input data or project_id not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Conflict. Organizational unit name already exists in this project.',
  })
  create(
    @Body() createOrganizationalUnitDto: CreateOrganizationalUnitDto,
  ): Promise<OrganizationalUnit> {
    return this.organizationalUnitService.new(createOrganizationalUnitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizational units' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all organizational units.',
    type: [OrganizationalUnit],
  })
  findAll(): Promise<OrganizationalUnit[]> {
    return this.organizationalUnitService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organizational unit by ID' })
  @ApiParam({ name: 'id', description: 'Organizational Unit ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The organizational unit.',
    type: OrganizationalUnit,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organizational unit not found.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationalUnit | null> {
    return this.organizationalUnitService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organizational unit by ID' })
  @ApiParam({ name: 'id', description: 'Organizational Unit ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The organizational unit has been successfully updated.',
    type: OrganizationalUnit,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organizational unit not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Conflict. Organizational unit name already exists in this project.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationalUnitDto: UpdateOrganizationalUnitDto,
  ): Promise<OrganizationalUnit> {
    return this.organizationalUnitService.update(
      id,
      updateOrganizationalUnitDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an organizational unit by ID' })
  @ApiParam({ name: 'id', description: 'Organizational Unit ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The organizational unit has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organizational unit not found.',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.organizationalUnitService.delete(id);
  }
}
