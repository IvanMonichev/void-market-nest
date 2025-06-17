import { Controller, Post, Body, Param, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Client } from '../app.clients';

@Controller('payment')
export class PaymentController {
  constructor(private readonly httpService: HttpService) {}

  @Post('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    if (!body.status) {
      throw new HttpException('invalid body', 400);
    }

    try {
      this.httpService.post(
        `${Client.PaymentService}/orders/${id}/status`,
        body,
      );
    } catch (_: unknown) {
      throw new HttpException('payment service unreachable', 502);
    }
  }
}
