import { NestFactory } from '@nestjs/core';
import { RabbitMQPublisher } from 'src/rabbitmq/rabbitmq.publisher';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const publisher = app.get(RabbitMQPublisher);

  await publisher.connect(
    'amqp://guest:guest@localhost:5672/',
    'order_status_changed',
  );

  await app.listen(4030);
}
bootstrap();
