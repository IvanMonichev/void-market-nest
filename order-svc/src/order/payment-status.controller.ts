import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { OrderStatus } from '../enums/order-status.enum';

@Controller('payment')
export class PaymentStatusController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('order.status.updated')
  async handleOrderStatusUpdated(
    @Payload() data: { orderId: number; status: OrderStatus },
  ) {
    console.log('[Consumer] Received:', data);

    await this.orderService.updateStatusFromEvent(data.orderId, data.status);

    return { ok: true };
  }
}
