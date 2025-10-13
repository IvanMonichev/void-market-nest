import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from 'src/enums/order-status.enum';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({
    name: 'user_id',
    type: 'text',
    nullable: true,
  })
  userId: string | null;

  @Column({ name: 'status', type: 'varchar', length: 32 })
  status: OrderStatus;

  @Column({ name: 'total', type: 'numeric' })
  total: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    precision: 6,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    precision: 6,
  })
  updatedAt: Date;
}
