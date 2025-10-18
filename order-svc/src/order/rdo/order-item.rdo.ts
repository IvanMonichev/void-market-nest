import { Expose, Transform } from 'class-transformer';

export class OrderItemRDO {
  @Expose()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  id: number;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  quantity: number;

  @Expose()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  unitPrice: number;
}
