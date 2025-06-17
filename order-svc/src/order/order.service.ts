// order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { UpdateOrderDto } from 'src/order/dto/update-order-dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    let total = 0;
    const items = dto.items.map((item) => {
      total += item.quantity * item.unitPrice;
      return this.itemRepo.create(item);
    });

    const order = this.orderRepo.create({
      userId: dto.userId,
      status: dto.status,
      total,
      items,
    });

    return this.orderRepo.save(order);
  }

  async findById(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll(
    offset = 0,
    limit = 10,
  ): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await this.orderRepo.findAndCount({
      skip: offset,
      take: limit,
      relations: ['items'],
    });
    return { orders, total };
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const existing = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!existing) throw new NotFoundException('Order not found');

    await this.itemRepo.remove(existing.items);

    let newItems: OrderItem[] = [];
    let total = 0;

    if (dto.items && dto.items.length > 0) {
      newItems = dto.items.map((item) => {
        total += item.quantity * item.unitPrice;
        return this.itemRepo.create(item);
      });
    }

    const updated = this.orderRepo.merge(existing, {
      ...dto,
      items: newItems.length > 0 ? newItems : existing.items,
      total: newItems.length > 0 ? total : existing.total,
    });

    return this.orderRepo.save(updated);
  }

  async delete(id: number): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    await this.orderRepo.remove(order);
  }

  async updateStatusFromEvent(orderId: number, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) return;
    order.status = status;
    await this.orderRepo.save(order);
  }
}
