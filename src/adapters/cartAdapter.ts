import { Cart } from "../models/carts"
class CartAdapter {
    toModel(data:any):Cart{
        return{
            ...data
        };
    }
    calculateTotal(cart:Cart):number {
        return cart.products.reduce(
            (sum,item)=>sum+item.price*item.quantity,0
        )
    }
    calculateQuantity(cart:Cart):number{
        return cart.products.reduce(
            (sum,item)=>sum+item.quantity,0
        );
    }
}
export default new CartAdapter();