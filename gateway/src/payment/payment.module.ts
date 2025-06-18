import { Module } from '@nestjs/common';
import { HttpModule } from 'src/http/http.module';
import { PaymentController } from 'src/payment/payment.controller';

@Module({
  imports: [HttpModule],
  controllers: [PaymentController],
})
export class PaymentModule {}
