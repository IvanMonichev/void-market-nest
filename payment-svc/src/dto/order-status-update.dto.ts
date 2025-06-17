import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/enum/order-status';

export class OrderStatusUpdateDto {
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status: OrderStatus;
}
