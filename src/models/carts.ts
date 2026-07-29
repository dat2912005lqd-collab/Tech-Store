export interface CartItem {
    id: number;
    productId: number;
    title: string;
    price: number;
    quantity: number;
}

export interface CartProduct {
    id: number;
    productId:number;
    title:string;
    price:number;
    quantity:number;
    total:number;
    discountPercentage:number;
    discountTotal:number;
    thumbnail:string
}
export interface Cart{
    id:number;
    userId:number;
    products:CartProduct[];
    total:number;
    discountedTotal:number;
    totalQuantity:number;
    totalProducts:number;
}
export interface CheckoutData {
    fullName:string;
    phone:string;
    address:string;
    note?:string;
}
export interface Order {
    id:string;
    items:CartItem[];
    total:number;
}