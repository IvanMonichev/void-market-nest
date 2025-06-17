import { Expose } from 'class-transformer';

export class OrderItemRDO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  unitPrice: number;
}
