import { IRole } from '../interfaces/role.interface';
import { ApiProperty } from '@nestjs/swagger';

export class RoleMapper {
  @ApiProperty({ example: 'ADMIN', description: 'Role name' })
  name: string;

  @ApiProperty({
    example: 'Administrator role',
    description: 'Role description',
    required: false,
  })
  description?: string | null;

  constructor(role: IRole) {
    this.name = role.name;
    this.description = role.description ?? null;
  }

  static map(role: IRole): RoleMapper {
    return new RoleMapper(role);
  }

  static mapArray(roles: IRole[]): RoleMapper[] {
    return roles.map(RoleMapper.map);
  }
}
