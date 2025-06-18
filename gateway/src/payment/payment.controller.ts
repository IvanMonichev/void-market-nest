import { Controller, Post, Body, Param, HttpException } from '@nestjs/common';
import { AxiosClient } from 'src/http/http.service';
import { Client } from '../app.clients';

@Controller('payment')
export class PaymentController {
  constructor(private readonly http: AxiosClient) {}

  @Post('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: string;
    },
  ) {
    if (!body.status) {
      throw new HttpException('invalid body', 400);
    }

    try {
      await this.http.post(
        `${Client.PaymentService}/orders/${id}/status`,
        body,
      );
    } catch (_: unknown) {
      throw new HttpException('payment service unreachable', 502);
    }
  }
}
