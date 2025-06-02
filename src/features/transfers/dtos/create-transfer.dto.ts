import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransferType } from '../entities/transfer.entity';

export class CreateTransferDto {
  @ApiProperty({
    enum: TransferType,
    example: TransferType.INBOUND,
    description: 'The type of the transfer',
  })
  @IsNotEmpty()
  @IsEnum(TransferType)
  type: TransferType;

  @ApiProperty({ example: 1, description: 'ID of the vehicle involved' })
  @IsNotEmpty()
  @IsNumber()
  vehicle_id: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the client user (optional)',
  })
  @IsOptional()
  @IsNumber()
  client_id?: number;

  @ApiProperty({ example: 1, description: 'ID of the project' })
  @IsNotEmpty()
  @IsNumber()
  project_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the organizational unit',
  })
  @IsNotEmpty()
  @IsNumber()
  organizational_unit_id: number;

  @ApiPropertyOptional({
    example: '2023-10-27T10:00:00.000Z',
    description:
      'The date of the transfer (defaults to current time if not provided)',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date) // Ensure proper transformation from string to Date
  transferDate?: Date;
}
