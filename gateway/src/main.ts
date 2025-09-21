import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(morgan('dev'));
  const PORT = 4020;
  await app.listen(PORT);
  Logger.log(
    `🚀 Payment Service is running on http://localhost:${PORT}/api/`,
    'Bootstrap',
  );
}
bootstrap();
