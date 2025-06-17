import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('APP_PORT') ?? 8030;
  await app.startAllMicroservices();
  await app.listen(PORT);
  Logger.log(
    `🚀 Payment Service is running on http://localhost:${PORT}`,
    'Bootstrap',
  );
}
bootstrap();
