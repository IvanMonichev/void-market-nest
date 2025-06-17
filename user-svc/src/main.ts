import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.APP_PORT || 3000;

  await app.listen(PORT);

  Logger.log(`🚀 App is running on http://localhost:${PORT}`, 'Bootstrap');
}
bootstrap();
