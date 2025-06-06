import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { ShippingDetails, OrderItem, PaymentResult } from '@/interfaces';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @Column('jsonb')
  orderItems!: OrderItem[];

  @Column('jsonb')
  shippingDetails!: ShippingDetails;

  @Column()
  paymentMethod!: string;

  @Column('jsonb', { nullable: true })
  paymentResult!: PaymentResult;

  @Column('float', { default: 0 })
  taxPrice!: number;

  @Column('float', { default: 0 })
  shippingPrice!: number;

  @Column('float', { default: 0 })
  itemsPrice!: number;

  @Column('float', { default: 0 })
  totalPrice!: number;

  @Column({ default: false })
  isPaid!: boolean;

  @Column({ nullable: true })
  paidAt!: string;

  @Column({ default: false })
  isDelivered!: boolean;

  @Column({ nullable: true })
  deliveredAt!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
