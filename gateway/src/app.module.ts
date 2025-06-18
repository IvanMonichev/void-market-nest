import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderModule } from 'src/order/order.module';
import { PaymentModule } from 'src/payment/payment.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [HttpModule, OrderModule, PaymentModule, UserModule],
})
export class AppModule {}
