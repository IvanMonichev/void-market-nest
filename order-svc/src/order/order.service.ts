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
      return this.itemRepo.create({
        name: item.name,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      });
    });

    const order = this.orderRepo.create({
      userId: dto.userId,
      status: dto.status,
      total: String(total),
      items,
      // createdAt/updatedAt handled by @CreateDateColumn/@UpdateDateColumn
    });

    return this.orderRepo.save(order);
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: id as any },
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

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const existing = await this.orderRepo.findOne({
      where: { id: id as any },
      relations: ['items'],
    });
    if (!existing) throw new NotFoundException('Order not found');

    await this.itemRepo.remove(existing.items);

    let newItems: OrderItem[] = [];
    let total = 0;

    if (dto.items && dto.items.length > 0) {
      newItems = dto.items.map((item) => {
        total += item.quantity * item.unitPrice;
        return this.itemRepo.create({
          name: item.name,
          quantity: String(item.quantity),
          unitPrice: String(item.unitPrice),
        });
      });
    }

    const updated = this.orderRepo.merge(existing, {
      ...dto,
      items: newItems.length > 0 ? newItems : existing.items,
      total: newItems.length > 0 ? String(total) : existing.total,
    });

    return this.orderRepo.save(updated);
  }

  async delete(id: string): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id: id as any } });
    if (!order) throw new NotFoundException('Order not found');
    await this.orderRepo.remove(order);
  }

  async updateStatusFromEvent(orderId: number, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id: String(orderId) as any } });
    if (!order) return;
    order.status = status;
    await this.orderRepo.save(order);
  }
}
