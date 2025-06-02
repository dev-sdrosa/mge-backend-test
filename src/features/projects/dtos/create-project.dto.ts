import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'New Super Project',
    description: 'The name of the project',
    maxLength: 255,
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'This is a detailed description of the new super project.',
    description: 'Optional description for the project',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
