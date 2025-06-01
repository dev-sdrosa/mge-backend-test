import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { CrudService } from 'src/features/crud/providers/crud.service';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { RoleService } from 'src/features/auth/providers/role.service';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RoleService,
  ) {
    super(userRepository.rp);
  }

  public async new(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const formattedEmail = email.toLowerCase();
    await this.checkEmailUniqueness(formattedEmail);

    const defaultRole = await this.rolesService.getDefaultUserRole();

    const user = this.userRepository.create({
      email: formattedEmail,
      username: username,
      password_hash: await hash(password, 10),
      roles: [defaultRole],
    });

    return user;
  }

  public async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  public async findOneByUsername(
    username: string,
    forAuth = false,
  ): Promise<User> {
    const user = await this.userRepository.rp.findOne({
      where: { username: username.toLowerCase() },
    });
    if (forAuth) {
      this.throwUnauthorizedException(user);
    } else {
      if (!user) {
        throw new NotFoundException('This user does not exists');
      }
    }

    return user;
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.rp.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  public async uncheckedUserByEmail(email: string): Promise<User> {
    return this.userRepository.rp.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  public async findOneByCredentials(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private throwUnauthorizedException(user: undefined | null | User): void {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async checkEmailUniqueness(email: string): Promise<void> {
    const count = await this.userRepository.rp.count({
      where: { email: email },
    });

    if (count > 0) {
      throw new ConflictException('Email already in use');
    }
  }

  public async findUserWithRolesAndPermissions(
    id: number,
  ): Promise<User | null> {
    const user = await this.userRepository.findByIdWithRolesAndPermissions(id);
    return user;
  }
}
