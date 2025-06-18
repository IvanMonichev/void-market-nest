import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const PORT = 8000;
  await app.listen(PORT);
  Logger.log(
    `🚀 Payment Service is running on http://localhost:${PORT}/api/`,
    'Bootstrap',
  );
}
bootstrap();
