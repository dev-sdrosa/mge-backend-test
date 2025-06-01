import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

export function setupApp(app: INestApplication): void {
  const configService = app.get(ConfigService);

  // Security
  const cookieSecret = configService.get<string>('COOKIE_SECRET');
  app.use(cookieParser(cookieSecret));
  app.use(helmet());

  // CORS
  const corsOriginsString = configService.get<string>('CORS_ORIGINS');
  const allowedOrigins = corsOriginsString
    ? corsOriginsString.split(',').map((origin) => origin.trim())
    : [];

  app.enableCors({
    credentials: true,
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Prefix
  app.setGlobalPrefix('api');

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS MGE API')
    .setDescription('A MGE API made with NestJS')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
}
