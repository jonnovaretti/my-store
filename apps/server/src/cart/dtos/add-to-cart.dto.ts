import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

export class AddToCartDto {
  @IsOptional()
  product?: Product;

  @IsNumber()
  qty!: number;

  @IsString()
  productId!: string;
}
