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
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 24,
    nullable: true,
  })
  userId: string | null;

  @Column({ name: 'status', type: 'enum', enum: OrderStatus, nullable: true })
  status: OrderStatus;

  @Column({ name: 'total', type: 'float', nullable: true })
  total: number;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    nullable: true,
  })
  items: OrderItem[];

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
