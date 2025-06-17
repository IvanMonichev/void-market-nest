// src/order/order.events.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { OrderStatus } from '../enums/order-status.enum';

@Controller()
export class OrderEventsController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('order.status.updated')
  async handleOrderStatusUpdate(
    @Payload()
    data: {
      orderId: number;
      status: OrderStatus;
    },
  ) {
    await this.orderService.updateStatusFromEvent(data.orderId, data.status);
  }
}
