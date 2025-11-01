import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderController } from './order.controller';
import { PaymentStatusController } from './payment-status.controller';
import { OrderService } from './order.service';
import { OrderEventsController } from './order.event';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [
    OrderController,
    OrderEventsController,
    PaymentStatusController,
  ],
  providers: [OrderService],
})
export class OrderModule {}
