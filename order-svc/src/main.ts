import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${configService.get('RABBITMQ_USER')}:${configService.get(
          'RABBITMQ_PASSWORD',
        )}@${configService.get('RABBITMQ_HOST')}:${configService.get(
          'RABBITMQ_PORT',
        )}`,
      ],
      queue: configService.get<string>('RABBITMQ_ORDER_QUEUE'),
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  const port = configService.get<number>('APP_PORT') ?? 3000;
  await app.listen(port);
  Logger.log(`🚀 App is running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
