import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { Vehicle } from '../entities/vehicle.entity';
import { CrudService } from 'src/features/crud/providers/crud.service';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';

@Injectable()
export class VehicleService extends CrudService<Vehicle> {
  constructor(private readonly vehicleRepository: VehicleRepository) {
    super(vehicleRepository.rp);
  }

  async new(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const { plate, service } = createVehicleDto;

    const existingVehicle = await this.vehicleRepository.rp.findOne({
      where: { plate },
    });
    if (existingVehicle) {
      throw new ConflictException(
        `Vehicle with plate "${plate}" already exists.`,
      );
    }
    return this.vehicleRepository.create({ plate, service });
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID "${id}" not found.`);
    }

    const { plate, service } = updateVehicleDto;

    if (plate && plate !== vehicle.plate) {
      const existingVehicleWithNewPlate =
        await this.vehicleRepository.rp.findOne({
          where: { plate },
        });
      if (
        existingVehicleWithNewPlate &&
        existingVehicleWithNewPlate.id !== id
      ) {
        throw new ConflictException(
          `Vehicle with plate "${plate}" already exists.`,
        );
      }
      vehicle.plate = plate;
    }

    if (service !== undefined) {
      vehicle.service = service;
    }

    return this.vehicleRepository.rp.save(vehicle);
  }
}
