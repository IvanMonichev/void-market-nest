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
    length: 255,
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 32,
    nullable: false,
  })
  status: OrderStatus;

  @Column({
    name: 'total',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  total: number;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: OrderItem[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;
}
