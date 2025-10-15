import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from '../enums/order-status.enum';

@Controller('payment')
export class PaymentStatusController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders/:id/status')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: OrderStatus },
  ) {
    if (!body?.status) return;
    await this.orderService.updateStatusFromEvent(id, body.status);
  }
}
