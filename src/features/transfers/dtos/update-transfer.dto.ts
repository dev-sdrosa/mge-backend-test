import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { TransferType } from '../entities/transfer.entity';

export class UpdateTransferDto {
  @ApiPropertyOptional({
    enum: TransferType,
    example: TransferType.OUTBOUND,
    description: 'The type of the transfer',
  })
  @IsOptional()
  @IsEnum(TransferType)
  type?: TransferType;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the vehicle involved',
  })
  @IsOptional()
  @IsNumber()
  vehicle_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the client user',
  })
  @IsOptional()
  @IsNumber()
  client_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID of the project' })
  @IsOptional()
  @IsNumber()
  project_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the organizational unit',
  })
  @IsOptional()
  @IsNumber()
  organizational_unit_id?: number;

  @ApiPropertyOptional({
    example: '2023-10-28T12:00:00.000Z',
    description: 'The date of the transfer',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  transferDate?: Date;
}
