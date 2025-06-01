import { forwardRef, Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { AuthController } from './controllers/auth.controller';
import { RoleService } from './providers/role.service';
import { PermissionSeederService } from './seeders/permission.seeder.service';
import { RoleSeederService } from './seeders/role.seeder.service';
import { RoleRepository } from './repositories/role.repository';
import { RoleController } from './controllers/role.controller';
import { PermissionRepository } from './repositories/permission.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, Role]),
    forwardRef(() => UsersModule),
    JwtModule,
  ],
  controllers: [AuthController, RoleController],
  providers: [
    AuthService,
    RoleService,
    PermissionSeederService,
    RoleSeederService,
    RoleRepository,
    PermissionRepository
  ],
  exports: [
    AuthService,
    RoleService,
    PermissionSeederService,
    RoleSeederService,
    RoleRepository,
    PermissionRepository,
  ],
})
export class AuthModule {}
