export interface CartItem {
    id: number;
    productId: number;
    title: string;
    price: number;
    quantity: number;
}

export interface CartProduct {
    id: number;
    products: CartItem[];
}
export interface CheckoutData {
    fullName:string;
}
export interface Order {
    id:string;
    items:CartItem[];
    total:number;
}