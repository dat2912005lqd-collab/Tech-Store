export interface User{
    id:string;
    fullName:string;
    email:string;
    role:'user'|'admin';
}
export interface Category{
    id:string;
    slug:string;
    name:string;
    url:string;
}
export interface Product{
    id:string;
    name:string;
    price:number;
}
export interface CartProduct extends Product{
    quantity:number;
}
export interface Order{
    id:string;
    userId:string;
    items:CartProduct[];
    total:number;
    status:string;
}