import { Product } from './product';
export interface CartItem{
    product:Product;
    quantity:number;
}
export interface CheckoutData {
    fullName:string;

}
export interface Order {
    id:string;
    items:
}