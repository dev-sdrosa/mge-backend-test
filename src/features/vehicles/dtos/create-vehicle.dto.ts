import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'ABC-1234',
    description: 'The license plate of the vehicle',
    maxLength: 20,
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  plate: string;

  @ApiPropertyOptional({
    example: 'Internal Transport',
    description: 'The type of service the vehicle provides',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  service?: string;
}
