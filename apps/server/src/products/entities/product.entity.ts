import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  brand!: string;

  @Column()
  brandLogo!: string;

  @Column()
  category!: string;

  @Column('text', { array: true })
  images!: string[];

  @Column()
  description!: string;

  @OneToMany(() => Review, review => review.product, { cascade: true, eager: true })
  reviews!: Review[];

  @Column({ default: 0 })
  rating!: number;

  @Column({ default: 0 })
  numReviews!: number;

  @Column('float', { default: 0 })
  price!: number;

  @Column({ default: 0 })
  countInStock!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
