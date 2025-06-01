import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { CommonModule } from './common/common.module';
import { CrudModule } from './features/crud/crud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),

    // Shared
    CommonModule,
    CrudModule,
  ],
})
export class AppModule {}
