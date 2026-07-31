
import type  {CartProduct} from "@/models/carts";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
}

export type PaymentMethod =
  | "cod"
  | "bank"
  | "momo"
  | "zalopay";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled";

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

export interface Order {
  id: number;

  items: OrderItem[];

  totalQuantity: number;

  subtotal: number;

  discount: number;

  shippingFee: number;

  total: number;

  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;

  status: OrderStatus;

  createdAt: string;
}

export interface CreateOrderPayload {
  items: CartProduct[];

  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;
}