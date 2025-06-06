import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentResult } from 'src/interfaces';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepo: Repository<Order>) {}

  async create(
    orderAttrs: Partial<Order>,
    userId: string,
  ): Promise<Order> {
    const {
      orderItems,
      shippingDetails,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = orderAttrs;

    if (orderItems && orderItems.length < 1)
      throw new BadRequestException('No order items received.');

    const createdOrder = await this.orderRepo.save({
      user: { id: userId } as any,
      orderItems,
      shippingDetails,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    return createdOrder;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepo.find();

    return orders;
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['user'] });

    if (!order) throw new NotFoundException('No order with given ID.');

    return order;
  }

  async updatePaid(
    id: string,
    paymentResult: PaymentResult,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) throw new NotFoundException('No order with given ID.');

    order.isPaid = true;
    order.paidAt = Date();
    order.paymentResult = paymentResult;

    const updatedOrder = await this.orderRepo.save(order);

    return updatedOrder;
  }

  async updateDelivered(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) throw new NotFoundException('No order with given ID.');

    order.isDelivered = true;
    order.deliveredAt = Date();

    const updatedOrder = await this.orderRepo.save(order);

    return updatedOrder;
  }

  async findUserOrders(userId: string) {
    const orders = await this.orderRepo.find({ where: { user: { id: userId } } });

    return orders;
  }
}
