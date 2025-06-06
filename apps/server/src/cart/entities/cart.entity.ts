import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { CartItem, ShippingDetails } from '@/interfaces';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @Column('jsonb')
  items!: CartItem[];

  @Column('jsonb', { nullable: true })
  shippingDetails?: ShippingDetails;

  @Column({ default: 'PayPal' })
  paymentMethod!: string;

  @Column('float', { default: 0 })
  itemsPrice!: number;

  @Column('float', { default: 0 })
  taxPrice!: number;

  @Column('float', { default: 0 })
  shippingPrice!: number;

  @Column('float', { default: 0 })
  totalPrice!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
