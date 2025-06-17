import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderController } from './order/order.controller';
import { PaymentController } from './payment/payment.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [HttpModule],
  controllers: [OrderController, PaymentController, UserController],
})
export class AppModule {}
