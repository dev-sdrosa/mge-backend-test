import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { TransferService } from './providers/transfer.service';
import { TransferRepository } from './repositories/transfer.repository';
import { ProjectsModule } from 'src/features/projects/projects.module';
import { TransferController } from './controllers/transfer.controller';
import { VehicleModule } from '../vehicles/vehicle.module';
import { OrganizationalUnitsModule } from '../organizational-units/organizational-unit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transfer]),
    VehicleModule,
    ProjectsModule,
    OrganizationalUnitsModule,
  ],
  controllers: [TransferController],
  providers: [TransferService, TransferRepository],
  exports: [TransferService],
})
export class TransfersModule {}
