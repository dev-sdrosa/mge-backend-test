import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/features/users/providers/user.service';
import { RoleEnum } from 'src/features/auth/enums/role.enum';
import { User } from 'src/features/users/entities/user.entity';

interface UserSeedData {
  username: string;
  email: string;
  password?: string;
  role: RoleEnum;
}

@Injectable()
export class UserSeederService {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting to seed users...');

    const adminEmail =
      this.configService.get<string>('SEED_ADMIN_EMAIL') || 'admin@example.com';
    const adminPassword =
      this.configService.get<string>('SEED_ADMIN_PASSWORD') ||
      'AdminPassword123!';

    const userEmail =
      this.configService.get<string>('SEED_USER_EMAIL') || 'user@example.com';
    const userPassword =
      this.configService.get<string>('SEED_USER_PASSWORD') ||
      'UserPassword123!';

    const usersToSeed: UserSeedData[] = [
      {
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        role: RoleEnum.ADMIN,
      },
      {
        username: 'user',
        email: userEmail,
        password: userPassword,
        role: RoleEnum.USER,
      },
    ];

    for (const userData of usersToSeed) {
      await this.ensureUserExists(userData);
    }

    this.logger.log('Users seeding finished.');
  }

  private async ensureUserExists(userData: UserSeedData): Promise<void> {
    let userShouldBeCreated = false;

    try {
      const existingUser: User | null =
        await this.userService.findOneByEmail(userData.email);

      if (existingUser) {
        this.logger.log(
          `User with email "${userData.email}" already exists. Skipping.`,
        );
      } else {
        this.logger.log(`User with email "${userData.email}" not found. Proceeding to create.`);
        userShouldBeCreated = true;
      }
    } catch (error) {
      if (error instanceof NotFoundException || (error.status && error.status === 404)) {
        this.logger.log(
          `User with email "${userData.email}" not found (404/NotFoundException). Proceeding to create.`,
        );
        userShouldBeCreated = true;
      } else if (error instanceof UnauthorizedException || (error.status && (error.status === 401 || error.status === 403))) {
        this.logger.warn(
          `UserService.findOneByEmail threw ${error.name} (status ${error.status}) for "${userData.email}". ` +
          `Assuming user does not exist for seeding purposes and attempting creation. ` +
          `This may indicate an issue in UserService.findOneByEmail that should be investigated.`,
        );
        userShouldBeCreated = true;
      } else {
        this.logger.error(
          `Error during existence check for user "${userData.email}": ${error.message}. Creation will be skipped.`,
          error.stack,
        );
        // Do not proceed to creation if the check itself failed unexpectedly
        return;
      }
    }

    if (userShouldBeCreated) {
      try {
        await this.userService.new(
          userData.email,
          userData.username,
          userData.password,
          userData.role,
        );
        this.logger.log(
          `User "${userData.username}" (${userData.email}) created successfully with role ${userData.role}.`,
        );
        this.logger.warn(
          `User "${userData.username}" created with default password: ${userData.password}. Please change it in a production environment.`,
        );
      } catch (creationError) {
        this.logger.error(
          `Failed to create user "${userData.username}" (${userData.email}) after existence check: ${creationError.message}`,
          creationError.stack,
        );
      }
    }
  }
}