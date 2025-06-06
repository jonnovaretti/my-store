import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Product } from './product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('float')
  rating!: number;

  @Column()
  comment!: string;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @ManyToOne(() => Product, product => product.reviews)
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
