// order.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateOrderDto } from 'src/order/dto/update-order-dto';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { plainToInstance } from 'class-transformer';
import { OrderRDO } from './rdo/order.rdo';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(201)
  async create(@Body() dto: CreateOrderDto) {
    await this.orderService.create(dto);
    return;
  }

  @Get('/all')
  async findAll(@Query('offset') offset = '0', @Query('limit') limit = '10') {
    const { orders, total } = await this.orderService.findAll(+offset, +limit);

    const baseUrl =
      this.configService.get<string>('USER_SERVICE_URL') ||
      'http://nest.user-svc:4021/users';

    const withUsers = await Promise.all(
      orders.map(async (o) => {
        let user: any = null;
        try {
          const resp = await fetch(`${baseUrl}/${o.userId}`);
          if (resp.ok) {
            user = await resp.json();
          }
        } catch (_e) {
          user = null;
        }

        const rdo = plainToInstance(OrderRDO, o, {
          excludeExtraneousValues: true,
        }) as any;
        rdo.user = user;
        return rdo;
      }),
    );

    return { orders: withUsers, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findById(id);
    const baseUrl =
      this.configService.get<string>('USER_SERVICE_URL') ||
      'http://nest.user-svc:4021/users';
    let user: any = null;
    try {
      const resp = await fetch(`${baseUrl}/${order.userId}`);
      if (resp.ok) user = await resp.json();
    } catch (_e) {
      user = null;
    }
    const rdo = plainToInstance(OrderRDO, order, {
      excludeExtraneousValues: true,
    }) as any;
    rdo.user = user;
    return rdo;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    const updated = await this.orderService.update(id, dto);
    return plainToInstance(OrderRDO, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return this.orderService.delete(id);
  }
}
