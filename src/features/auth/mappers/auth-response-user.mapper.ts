import { IUser } from 'src/features/users/interfaces/user.interface';
import { IAuthResponseUser } from '../interfaces/auth-response-user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseUserMapper implements IAuthResponseUser {
  @ApiProperty({
    description: 'User id',
    example: 123,
    minimum: 1,
    type: Number,
  })
  public id: number;

  @ApiProperty({
    description: 'User username',
    example: 'john.doe1',
    minLength: 3,
    maxLength: 106,
    type: String,
  })
  public username: string;

  @ApiProperty({
    description: 'The user email',
    example: 'example@gmail.com',
    minLength: 5,
    maxLength: 255,
    type: String,
  })
  public email!: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2021-01-01T00:00:00.000Z',
    type: String,
  })
  public created_at: string;

  @ApiProperty({
    description: 'User last update date',
    example: '2021-01-01T00:00:00.000Z',
    type: String,
  })
  public updated_at: string;

  constructor(values: IAuthResponseUser) {
    Object.assign(this, values);
  }

  public static map(user: IUser): AuthResponseUserMapper {
    return new AuthResponseUserMapper({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    });
  }
}
