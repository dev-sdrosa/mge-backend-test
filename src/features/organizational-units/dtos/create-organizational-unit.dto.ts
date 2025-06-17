import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

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

  @ApiPropertyOptional({
    description:
      'Optional list of user IDs to associate with the organizational unit.',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  userIds?: number[];
}
