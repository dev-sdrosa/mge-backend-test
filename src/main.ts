import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupApp } from './config/app.setup';
import { PermissionSeederService } from './features/auth/seeders/permission.seeder.service';
import { RoleSeederService } from './features/auth/seeders/role.seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupApp(app);

  if (configService.get<string>('NODE_ENV') === 'development') {
    const permissionSeeder = app.get(PermissionSeederService);
    const roleSeeder = app.get(RoleSeederService);
    await permissionSeeder.seed();
    await roleSeeder.seed();
  }

  const port = configService.get<number>('PORT');
  await app.listen(port).then(() => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap();
