import { IsString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'src/enums/order-status.enum';
import { OrderItemDto } from 'src/order/dto/order-item.dto';

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
