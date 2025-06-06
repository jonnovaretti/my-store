import { Product } from 'src/products/entities/product.entity';

export interface ShippingDetails {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  productId: Product;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
  provider?: 'PayPal' | 'Stripe';
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface PaginatedProducts {
  products: Product[];
  pages: number;
  page: number;
}
