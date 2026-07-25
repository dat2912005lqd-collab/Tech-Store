export interface Review{
    rating:number;
    comment:string;
    date:string;
    reviewerName:string;
    reviewerEmail:string;
}
export interface Product{
    id:string;
    title:string;
    description:string;
    price:number;
    discountPercentage:number;
    rating:number;
    stock:number;
    brand:string;
    thumbnail:string;
    image:string;
    reviews:Review[];
}