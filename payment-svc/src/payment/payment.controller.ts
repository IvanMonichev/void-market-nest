import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { OrderStatusUpdateDto } from 'src/dto/order-status-update.dto';
import { OrderStatus } from 'src/enum/order-status';
import { PaymentPublisher } from 'src/rabbitmq/rabbitmq.publisher';

@Controller('payment/orders')
export class PaymentController {
  constructor(private readonly publisher: PaymentPublisher) {}

  @Post(':id/status')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: OrderStatusUpdateDto,
  ) {
    if (!dto.status) {
      throw new BadRequestException('Status is required');
    }

    await this.publisher.publishStatusUpdate({
      orderId: id,
      status: dto.status,
    });

    return { message: 'status update published' };
  }
}
