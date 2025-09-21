import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderStatus } from 'src/enums/order-status.enum';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 24,
    nullable: true,
  })
  userId: string | null;

  @Column({ name: 'status', type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ name: 'total', type: 'float' })
  total: number;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;
}
