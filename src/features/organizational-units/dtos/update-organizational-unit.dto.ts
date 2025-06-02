import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';

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
}
