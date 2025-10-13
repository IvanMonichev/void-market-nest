import { Expose, Transform, Type } from 'class-transformer';
import { OrderItemRDO } from './order-item.rdo';

export class OrderRDO {
  @Expose()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
  id: number;

  @Expose()
  userId: string;

  @Expose()
  status: string;

  @Expose()
  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  total: number;

  @Expose()
  @Type(() => OrderItemRDO)
  items: OrderItemRDO[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
