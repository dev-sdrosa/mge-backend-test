import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { VehicleService } from '../providers/vehicle.service';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Vehicle } from '../entities/vehicle.entity';
import { AuthGuard } from 'src/features/auth/guards/auth.guard';
import { RolesGuard } from 'src/features/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/features/auth/guards/permissions.guard';
import { UseGuards } from '@nestjs/common';
import { RoleEnum } from 'src/features/auth/enums/role.enum';
import { Roles } from 'src/features/auth/decorators/roles.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The vehicle has been successfully created.',
    type: Vehicle,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid input data.',
  })
  @Roles(RoleEnum.ADMIN)
  create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleService.new(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all vehicles.',
    type: [Vehicle],
  })
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  findAll(): Promise<Vehicle[]> {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The vehicle.',
    type: Vehicle,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found.',
  })
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Vehicle | null> {
    return this.vehicleService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The vehicle has been successfully updated.',
    type: Vehicle,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found.',
  })
  @Roles(RoleEnum.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a vehicle by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The vehicle has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found.',
  })
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.vehicleService.delete(id);
  }
}
