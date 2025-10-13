import {
  IsString,
  IsEnum,
  IsArray,
  IsInt,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';
import { OrderStatus } from 'src/order/order-status.enum';

/* -------------------------------------------
 * DTO (Data Transfer Objects) для входящих данных
 * -------------------------------------------
 */

export class CreateOrderItemDto {
  @IsString()
  name: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

/* -------------------------------------------
 * RDO (Response Data Objects) для ответов наружу
 * -------------------------------------------
 */

export class OrderItemRdo {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  unitPrice: number;
}

export class UserRdo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;
}

export class OrderRdo {
  @Expose()
  id: number;

  @Expose()
  userId: string;

  @Expose()
  status: string;

  @Expose()
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  total: number;

  @Expose()
  @Type(() => OrderItemRdo)
  items: OrderItemRdo[];

  @Expose()
  @Type(() => UserRdo)
  user: UserRdo | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
