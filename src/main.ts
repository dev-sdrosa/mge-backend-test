import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupApp } from './config/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupApp(app);

  const port = configService.get<number>('PORT');
  await app.listen(port).then(() => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap();
