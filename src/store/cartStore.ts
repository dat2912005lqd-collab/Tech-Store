import { create } from "zustand";
import { CartProduct } from "../models/carts";
interface CartState{
    items:CartProduct[];
    total:number;
    addItem:(
        item:CartProduct
    )=>void;
    removeItem:(
        id:number
    )=>void;
    clearCart:()=>void;
}
export const useCartStore=create<CartState>(
    (set,get)=>({
        items:[],
        total:0,
        addItem:(item)=>{
            const items=[
                ...get().items, item
            ];
            set({
                items,total:item.reduce(
                    (sum:number,i:CartProduct)=>sum+i.price*i.quantity,0)
    });
},
removeItem:(id)=>{
    const items=get().items.filter(
        i=>i.id!==id
    );
    set({
        items, total:items.reduce(
            (sum,i)=>sum+i.price*i.quantity,0)
    });
},
clearCart:()=>
    set({
        items:[],
        total:0
    })
})
);
