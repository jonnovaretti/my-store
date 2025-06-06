import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controller/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Review } from './entities/review.entity';
import { AppService } from '@/app/services/app.service';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { AiModule } from '@/ai/ai.module';
import { ProductExpertAgent } from '@/ai/agents/product-expert.agent';
import { Order } from '@/orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Review, Order]),
    CloudinaryModule,
    AiModule,
  ],
  providers: [ProductsService, AppService, ProductExpertAgent],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
