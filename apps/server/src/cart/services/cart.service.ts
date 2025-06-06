import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { ProductsService } from '../../products/services/products.service';
import { CartItem, ShippingDetails } from '../../interfaces';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    private productsService: ProductsService,
  ) {}

  async getCart(user: User): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { user: { id: user.id } } });

    if (!cart) {
      cart = await this.cartRepo.save({
        user,
        items: [],
      });
    }

    return cart;
  }

  private calculatePrices(cart: Cart) {
    cart.itemsPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    );
    cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2));
    cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;
    cart.totalPrice = cart.itemsPrice + cart.taxPrice + cart.shippingPrice;
    return cart;
  }

  async addCartItem(
    productId: string,
    qty: number,
    user: User,
  ): Promise<Cart> {
    const product = await this.productsService.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    if (qty > product.countInStock) {
      throw new BadRequestException('Not enough stock');
    }

    const cart = await this.getCart(user);
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.qty = qty;
    } else {
      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        countInStock: product.countInStock,
        qty,
      };
      cart.items.push(cartItem);
    }

    this.calculatePrices(cart);
    return this.cartRepo.save(cart);
  }

  async removeCartItem(
    productId: string,
    user: User,
  ): Promise<Cart> {
    const cart = await this.getCart(user);
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId,
    );
    this.calculatePrices(cart);
    return this.cartRepo.save(cart);
  }

  async updateCartItemQty(
    productId: string,
    qty: number,
    user: User,
  ): Promise<Cart> {
    const cart = await this.getCart(user);
    const item = cart.items.find(
      item => item.productId.toString() === productId,
    );

    if (!item) throw new NotFoundException('Item not found in cart');
    if (qty > item.countInStock)
      throw new BadRequestException('Not enough stock');

    item.qty = qty;
    this.calculatePrices(cart);
    return this.cartRepo.save(cart);
  }

  async clearCart(user: User): Promise<Cart> {
    const cart = await this.getCart(user);
    cart.items = [];
    this.calculatePrices(cart);
    return this.cartRepo.save(cart);
  }

  validateShippingDetails(shippingDetails: ShippingDetails): ShippingDetails {
    const { address, city, postalCode, country } = shippingDetails;

    if (!address || !city || !postalCode || !country) {
      throw new BadRequestException('All shipping fields are required');
    }
    return shippingDetails;
  }

  validatePaymentMethod(paymentMethod: string): string {
    const validMethods = ['PayPal', 'Stripe'];
    if (!validMethods.includes(paymentMethod)) {
      throw new BadRequestException('Invalid payment method');
    }
    return paymentMethod;
  }
}
