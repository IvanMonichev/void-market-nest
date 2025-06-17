import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentPublisher {
  constructor(@Inject('ORDER_QUEUE') private readonly client: ClientProxy) {}

  publishStatusUpdate(payload: { orderId: number; status: string }) {
    console.log('[Publisher] Sending:', payload);
    this.client.emit('order.status.updated', payload);
  }
}
