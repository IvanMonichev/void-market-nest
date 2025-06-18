import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { HttpModule } from 'src/http/http.module';

@Module({
  imports: [HttpModule],
  controllers: [OrderController],
})
export class OrderModule {}
