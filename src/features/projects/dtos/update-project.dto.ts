import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateProjectDto {
  @ApiPropertyOptional({
    example: "Updated Super Project Name",
    description: "The new name of the project",
    maxLength: 255,
    uniqueItems: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: "An updated detailed description of the project.",
    description: "Optional new description for the project",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: "Optional array of User IDs to associate with the project",
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  userIds?: number[];
}
