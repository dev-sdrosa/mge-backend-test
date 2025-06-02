import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';
import { CommonModule } from './common/common.module';
import { CrudModule } from './features/crud/crud.module';
import { JwtModule } from './features/jwt/jwt.module';
import { UsersModule } from './features/users/user.module';
import { AuthModule } from './features/auth/auth.module';
import { VehicleModule } from './features/vehicles/vehicle.module';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { ProjectsModule } from './features/projects/projects.module';
import { OrganizationalUnitsModule } from './features/organizational-units/organizational-unit.module';
import { TransfersModule } from './features/transfers/transfers.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),

    // Database and Migrations
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        entities: [path.join(__dirname, '..', '**', '*.entity.js')],
        synchronize: false,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // Shared
    CommonModule,
    CrudModule,

    // Features
    JwtModule,
    UsersModule,
    AuthModule,
    VehicleModule,
    ProjectsModule,
    OrganizationalUnitsModule,
    TransfersModule,

    // Routes

    RouterModule.register([
      {
        path: '',
        module: AuthModule,
      },
      {
        path: '',
        module: VehicleModule,
      },
      {
        path: '',
        module: ProjectsModule,
      },
      {
        path: '',
        module: OrganizationalUnitsModule,
      },
      {
        path: '',
        module: TransfersModule,
      },
    ]),
  ],
})
export class AppModule {}
