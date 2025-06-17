import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  Res,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosClient } from '../http/http.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly http: AxiosClient) {}

  @Post()
  async createOrder(@Body() body: any, @Res() res: Response) {
    const { userId } = body;
    if (!userId) {
      throw new HttpException('userId is required', 400);
    }

    try {
      await this.http.get(`http://user-svc:4010/users/${userId}`);
    } catch {
      throw new HttpException('invalid or missing user', 400);
    }

    try {
      const result = await this.http.post(`http://order-svc:4020/orders`, body);
      return res.status(201).json(result);
    } catch {
      throw new HttpException('order service unavailable', 502);
    }
  }

  @Get('all')
  async getAllOrders(
    @Query('offset') offset = '0',
    @Query('limit') limit = '10',
  ) {
    try {
      const { total, orders } = await this.http.get(
        `http://order-svc:4020/orders/all?offset=${offset}&limit=${limit}`,
      );

      const fullOrders = await Promise.all(
        orders.map(async (order) => {
          let user = null;
          try {
            user = await this.http.get(
              `http://user-svc:4010/users/${order.userId}`,
            );
          } catch {}

          return { ...order, user };
        }),
      );

      return { total, orders: fullOrders };
    } catch {
      throw new HttpException('failed to fetch orders', 502);
    }
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    try {
      const order = await this.http.get(`http://order-svc:4020/orders/${id}`);
      const user = await this.http.get(
        `http://user-svc:4010/users/${order.userId}`,
      );
      return { ...order, user };
    } catch {
      throw new HttpException('failed to fetch order or user', 502);
    }
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.http.put(
        `http://order-svc:4020/orders/${id}`,
        body,
      );
      return res.status(200).json(updated);
    } catch {
      throw new HttpException('order service unavailable', 502);
    }
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.http.delete(`http://order-svc:4020/orders/${id}`);
      return res.status(204).send();
    } catch {
      throw new HttpException('order service unavailable', 502);
    }
  }
}
