// order.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { UpdateOrderDto } from 'src/order/dto/update-order-dto';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { plainToInstance } from 'class-transformer';
import { OrderRDO } from './rdo/order.rdo';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.orderService.create(dto);
    return plainToInstance(OrderRDO, order, { excludeExtraneousValues: true });
  }

  @Get('/all')
  async findAll(@Query('offset') offset = '0', @Query('limit') limit = '10') {
    const { orders, total } = await this.orderService.findAll(+offset, +limit);
    return {
      total,
      orders: plainToInstance(OrderRDO, orders, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findById(id);
    return plainToInstance(OrderRDO, order, { excludeExtraneousValues: true });
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    const updated = await this.orderService.update(id, dto);
    return plainToInstance(OrderRDO, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.orderService.delete(id);
  }
}
