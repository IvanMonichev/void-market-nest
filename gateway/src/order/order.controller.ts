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
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosClient } from 'src/http/http.service';
import { Client } from 'src/app.clients';
import { CreateOrderDto, OrderRdo } from 'src/order/order.transport';
import { UserRdo, UsersRdo } from 'src/user/user.transport';

@Controller('orders')
export class OrderController {
  constructor(private readonly http: AxiosClient) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDto, @Res() res: Response) {
    const { userId } = body;

    if (!userId) {
      throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.http.get<UsersRdo>(`${Client.UserService}/${userId}`);
    } catch {
      throw new HttpException(
        'invalid or missing user',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.http.post<OrderRdo>(
        `${Client.OrderService}`,
        body,
      );
      return res.status(HttpStatus.CREATED).json(result);
    } catch {
      throw new HttpException(
        'order service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Get('all')
  async getAllOrders(
    @Query('offset') offset = '0',
    @Query('limit') limit = '10',
  ): Promise<{
    total: number;
    orders: (OrderRdo & { user: UserRdo | null })[];
  }> {
    try {
      const { total, orders }: { total: number; orders: OrderRdo[] } =
        await this.http.get(
          `${Client.OrderService}/all?offset=${offset}&limit=${limit}`,
        );

      const fullOrders = await Promise.all(
        orders.map(async (order) => {
          let user: UserRdo | null = null;
          try {
            user = await this.http.get<UserRdo>(
              `${Client.UserService}/${order.userId}`,
            );
          } catch {
            throw new HttpException(
              'failed to fetch users',
              HttpStatus.BAD_GATEWAY,
            );
          }
          return { ...order, user };
        }),
      );

      return { total, orders: fullOrders };
    } catch {
      throw new HttpException('failed to fetch orders', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get(':id')
  async getOrder(
    @Param('id') id: string,
  ): Promise<OrderRdo & { user: UserRdo }> {
    try {
      const order = await this.http.get<OrderRdo>(
        `${Client.OrderService}/${id}`,
      );
      const user = await this.http.get<UserRdo>(
        `${Client.UserService}/${order.userId}`,
      );
      return { ...order, user };
    } catch {
      throw new HttpException(
        'failed to fetch order or user',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() body: Partial<CreateOrderDto>,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.http.put<OrderRdo>(
        `${Client.OrderService}/${id}`,
        body,
      );
      return res.status(HttpStatus.OK).json(updated);
    } catch {
      throw new HttpException(
        'order service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.http.delete(`${Client.OrderService}/${id}`);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch {
      throw new HttpException(
        'order service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
