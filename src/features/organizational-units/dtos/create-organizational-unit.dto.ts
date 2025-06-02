import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsNumber } from 'class-validator';

export class CreateOrganizationalUnitDto {
  @ApiProperty({
    example: 'X Department',
    description: 'The name of the organizational unit',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the project this unit belongs to',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  project_id: number;
}
