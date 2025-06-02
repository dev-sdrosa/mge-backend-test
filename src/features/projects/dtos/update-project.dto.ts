import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

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
}
