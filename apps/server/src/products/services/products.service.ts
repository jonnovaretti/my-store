import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { sampleProduct } from '../../utils/data/product';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';
import { PaginatedResponse } from '../../../../shared/types';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
  ) {}

  async findTopRated(): Promise<Product[]> {
    const products = await this.productRepo.find({
      order: { rating: 'DESC' },
      take: 3,
    });

    if (!products.length) throw new NotFoundException('No products found.');

    return products;
  }

  async findMany(
    keyword?: string,
    page?: string,
    limit?: string,
  ): Promise<PaginatedResponse<Product>> {
    const pageSize = parseInt(limit ?? '10');
    const currentPage = parseInt(page ?? '1');

    const decodedKeyword = keyword ? decodeURIComponent(keyword) : '';

    const where = decodedKeyword
      ? [
          { name: ILike(`%${decodedKeyword}%`) },
          { description: ILike(`%${decodedKeyword}%`) },
          { brand: ILike(`%${decodedKeyword}%`) },
          { category: ILike(`%${decodedKeyword}%`) },
        ]
      : undefined;

    const [products, count] = await this.productRepo.findAndCount({
      where,
      take: pageSize,
      skip: pageSize * (currentPage - 1),
    });

    if (!products.length) throw new NotFoundException('No products found.');

    return {
      items: products,
      total: count,
      page: currentPage,
      pages: Math.ceil(count / pageSize),
    };
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) throw new NotFoundException('No product with given ID.');

    return product;
  }

  async createMany(products: Partial<Product>[]): Promise<Product[]> {
    const createdProducts = await this.productRepo.save(products);

    return createdProducts;
  }

  async update(id: string, attrs: Partial<Product>): Promise<Product> {
    const {
      name,
      price,
      description,
      images,
      brandLogo,
      brand,
      category,
      countInStock,
    } = attrs;

    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('No product with given ID.');

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.images = images ?? product.images;
    product.brandLogo = brandLogo ?? product.brandLogo;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.countInStock = countInStock ?? product.countInStock;

    return this.productRepo.save(product);
  }

  async deleteOne(id: string): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (!result.affected)
      throw new NotFoundException('No product with given ID.');
  }

  async deleteMany(): Promise<void> {
    await this.productRepo.clear();
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create({
      ...productData,
      rating: 0,
      numReviews: 0,
      reviews: [],
    });

    return this.productRepo.save(product);
  }
}
