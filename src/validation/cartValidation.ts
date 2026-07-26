import { CartProduct } from "../models/carts";

export const CartValidation={
    validate(items:CartProduct[]):string[]{
        const errors:string[]=[];
        if (items.length==0){
            errors.push("Cart is empty");
        }
        items.forEach(item=>{
            if(item.quantity<=0){
                errors.push(
                    `${item.title}: invalid quantity`);
            }
        });
        return errors;
    }
}