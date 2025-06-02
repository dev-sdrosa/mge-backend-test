import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupApp } from './config/app.setup';
import { PermissionSeederService } from './features/auth/seeders/permission.seeder.service';
import { RoleSeederService } from './features/auth/seeders/role.seeder.service';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  setupApp(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  if (configService.get<string>('NODE_ENV') === 'development') {
    const permissionSeeder = app.get(PermissionSeederService);
    const roleSeeder = app.get(RoleSeederService);
    await permissionSeeder.seed();
    await roleSeeder.seed();
  }

  const port = configService.get<number>('PORT');
  const domain = configService.get<number>('DOMAIN');

  await app.listen(port);
  logger.log(`Server is running on http://${domain}:${port}`);
  logger.log(`Swagger UI is available on http://${domain}:${port}/api/docs`);
}

bootstrap();
