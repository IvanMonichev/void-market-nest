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

    return { orders: orders, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const order = await this.orderService.findById(id);
    return order;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: number, @Body() dto: UpdateOrderDto) {
    const updated = await this.orderService.update(id, dto);
    return plainToInstance(OrderRDO, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number): Promise<void> {
    return this.orderService.delete(id);
  }
}
