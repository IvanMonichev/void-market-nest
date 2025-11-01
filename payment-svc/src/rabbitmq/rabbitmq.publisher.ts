import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  connect,
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';

@Injectable()
export class PaymentPublisher implements OnModuleInit, OnModuleDestroy {
  private connection!: AmqpConnectionManager;
  private channel!: ChannelWrapper;

  private readonly queueName =
    process.env.RABBITMQ_ORDER_QUEUE || 'order-status';
  private readonly amqpUrl =
    process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5673';

  onModuleInit(): void {
    this.connection = connect([this.amqpUrl]);
    this.channel = this.connection.createChannel({
      json: true,
      setup: async (ch) => {
        await ch.assertQueue(this.queueName, { durable: false });
      },
    });

    console.log('[RabbitMQ] Confirm channel ready:', this.queueName);
  }

  async publishStatusUpdate(payload: {
    orderId: number;
    status: string;
  }): Promise<void> {
    console.log('[Publisher] Sending:', payload);

    console.log('[Publisher] Sending:', payload);

    const start = performance.now();
    await this.channel.sendToQueue(this.queueName, payload, {
      persistent: true,
    });
    const end = performance.now();

    console.log(
      `[Publisher] Broker confirmed message in ${(end - start).toFixed(2)} ms:`,
      payload,
    );
    console.log('[Publisher] Broker confirmed message:', payload);
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
    console.log('[RabbitMQ] Connection closed');
  }
}
