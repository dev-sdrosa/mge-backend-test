import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({
    example: 'XYZ-5678',
    description: 'The new license plate of the vehicle',
    maxLength: 20,
    uniqueItems: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  plate?: string;

  @ApiPropertyOptional({
    example: 'External Logistics',
    description: 'The updated type of service the vehicle provides',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  service?: string;
}
