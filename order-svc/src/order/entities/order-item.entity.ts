import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'quantity', nullable: true })
  quantity: number;

  @Column({ name: 'unit_price', type: 'float', nullable: true })
  unitPrice: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;
}
