import { Expose, Transform } from 'class-transformer';

export class OrderItemRDO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  unitPrice: number;
}
