import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';
import { CommonModule } from './common/common.module';
import { CrudModule } from './features/crud/crud.module';
import { JwtModule } from './features/jwt/jwt.module';
import { UsersModule } from './features/users/user.module';
import { AuthModule } from './features/auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

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

    // Routes

    RouterModule.register([
      {
        path: '',
        module: AuthModule,
      },
    ]),
  ],
})
export class AppModule {}
