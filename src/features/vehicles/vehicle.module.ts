import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleService } from './providers/vehicle.service';
import { VehicleRepository } from './repositories/vehicle.repository';
import { VehicleController } from './controllers/vehicle.controller';
import { AuthModule } from 'src/features/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), AuthModule],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleRepository],
  exports: [VehicleService, VehicleRepository],
})
export class VehicleModule {}
