import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentPublisher {
  constructor(@Inject('ORDER_QUEUE') private readonly client: ClientProxy) {}

  async publishStatusUpdate(payload: { orderId: number; status: string }) {
    await this.client.emit('order.status.updated', payload);
  }
}
