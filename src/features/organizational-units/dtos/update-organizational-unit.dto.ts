import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  IsArray,
} from 'class-validator';

export class UpdateOrganizationalUnitDto {
  @ApiPropertyOptional({
    example: 'Advanced Engineering Department',
    description: 'The new name of the organizational unit',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: 2,
    description:
      'The new ID of the project this unit belongs to (Note: changing project might have side effects)',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  project_id?: number;

  @ApiPropertyOptional({
    description:
      'Optional list of user IDs to associate with the organizational unit. This will replace existing users if provided.',
    type: [Number],
    example: [3, 4],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  userIds?: number[];
}
