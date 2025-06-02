import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { In } from 'typeorm';
import { Transfer } from '../entities/transfer.entity';
import { CreateTransferDto } from '../dtos/create-transfer.dto';
import { UpdateTransferDto } from '../dtos/update-transfer.dto';
import { User } from 'src/features/users/entities/user.entity';
import { VehicleRepository } from 'src/features/vehicles/repositories/vehicle.repository';
import { ProjectRepository } from 'src/features/projects/repositories/project.repository';
import { OrganizationalUnitRepository } from 'src/features/organizational-units/repositories/organizational-unit.repository';
import { TransferRepository } from '../repositories/transfer.repository';
import { CrudService } from 'src/features/crud/providers/crud.service';

@Injectable()
export class TransferService extends CrudService<Transfer> {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly organizationalUnitRepository: OrganizationalUnitRepository,
  ) {
    super(transferRepository.rp);
  }

  private async _validateUserAccessToProjectAndOU(
    user: User,
    projectId: number,
    organizationalUnitId: number,
  ): Promise<void> {
    const hasProjectAccess = user.projects?.some((p) => p.id === projectId);
    if (!hasProjectAccess) {
      throw new ForbiddenException(
        `User does not have access to project ID ${projectId}.`,
      );
    }

    const ou = await this.organizationalUnitRepository.rp.findOne({
      where: { id: organizationalUnitId, project_id: projectId },
    });

    if (!ou) {
      throw new BadRequestException(
        `Organizational unit ID ${organizationalUnitId} does not exist or does not belong to project ID ${projectId}.`,
      );
    }

    const hasOUAccess = user.organizationalUnits?.some(
      (uou) => uou.id === organizationalUnitId,
    );
    if (!hasOUAccess) {
      throw new ForbiddenException(
        `User does not have access to organizational unit ID ${organizationalUnitId}.`,
      );
    }
  }

  private async _validateRelatedEntities(
    vehicleId: number,
    clientId?: number,
  ): Promise<void> {
    const vehicleExists = await this.vehicleRepository.findById(vehicleId);
    if (!vehicleExists) {
      throw new BadRequestException(
        `Vehicle with ID "${vehicleId}" not found.`,
      );
    }
  }

  async findAllForUser(user: User): Promise<Transfer[]> {
    if (!user.projects?.length || !user.organizationalUnits?.length) {
      return [];
    }

    const projectIds = user.projects.map((p) => p.id);
    const organizationalUnitIds = user.organizationalUnits.map((ou) => ou.id);

    return this.transferRepository.rp.find({
      where: {
        project_id: In(projectIds),
        organizational_unit_id: In(organizationalUnitIds),
      },
      relations: [
        'vehicle',
        'client',
        'transmitter',
        'project',
        'organizationalUnit',
      ],
    });
  }

  async createTransfer(
    createTransferDto: CreateTransferDto,
    user: User,
  ): Promise<Transfer> {
    const {
      project_id,
      organizational_unit_id,
      vehicle_id,
      client_id,
      type,
      transferDate,
    } = createTransferDto;

    await this._validateUserAccessToProjectAndOU(
      user,
      project_id,
      organizational_unit_id,
    );
    await this._validateRelatedEntities(vehicle_id, client_id);

    const transferData: Partial<Transfer> = {
      type,
      vehicle_id,
      client_id,
      project_id,
      organizational_unit_id,
      transmitter_id: user.id,
      transferDate: transferDate || new Date(),
    };

    return this.transferRepository.create(transferData);
  }

  async findOneByIdAndUser(id: number, user: User): Promise<Transfer> {
    const transfer = await this.transferRepository.rp.findOne({
      where: { id },
      relations: ['project', 'organizationalUnit'],
    });

    if (!transfer) {
      throw new NotFoundException(`Transfer with ID "${id}" not found.`);
    }

    await this._validateUserAccessToProjectAndOU(
      user,
      transfer.project_id,
      transfer.organizational_unit_id,
    );

    return this.transferRepository.rp.findOne({
      where: { id },
      relations: [
        'vehicle',
        'client',
        'transmitter',
        'project',
        'organizationalUnit',
      ],
    });
  }

  async updateTransfer(
    id: number,
    updateTransferDto: UpdateTransferDto,
    user: User,
  ): Promise<Transfer> {
    const transfer = await this.transferRepository.findById(id);
    if (!transfer) {
      throw new NotFoundException(`Transfer with ID "${id}" not found.`);
    }

    const targetProjectId = updateTransferDto.project_id || transfer.project_id;
    const targetOuId =
      updateTransferDto.organizational_unit_id ||
      transfer.organizational_unit_id;

    await this._validateUserAccessToProjectAndOU(
      user,
      targetProjectId,
      targetOuId,
    );

    if (updateTransferDto.vehicle_id) {
      await this._validateRelatedEntities(
        updateTransferDto.vehicle_id,
        updateTransferDto.client_id,
      );
    } else if (updateTransferDto.client_id) {
      await this._validateRelatedEntities(
        transfer.vehicle_id,
        updateTransferDto.client_id,
      );
    }

    Object.assign(transfer, updateTransferDto);

    return this.transferRepository.rp.save(transfer);
  }

  async deleteTransfer(id: number, user: User): Promise<void> {
    const transfer = await this.transferRepository.rp.findOne({
      where: { id },
      relations: ['organizationalUnit'],
    });

    if (!transfer) {
      throw new NotFoundException(`Transfer with ID "${id}" not found.`);
    }

    const hasOUAccess = user.organizationalUnits?.some(
      (ou) => ou.id === transfer.organizational_unit_id,
    );
    if (!hasOUAccess) {
      throw new ForbiddenException(
        `User does not have permission to delete transfers for organizational unit ID ${transfer.organizational_unit_id}.`,
      );
    }

    await this.transferRepository.delete(id);
  }
}
