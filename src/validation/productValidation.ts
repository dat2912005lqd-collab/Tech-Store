import { Product } from "../models/product";
export const ProductValidation={
    validate(product:Product):string[]{
        const errors:string[]=[];
        if (!product.title.trim()){
            errors.push("Product title is required");
        }
        if (product.price<=0){
            errors.push("Price must be greater than 0");
        }
        if (product.stock<0){
            errors.push("Stock cannot be negative");
        }
        return errors;
    }
}