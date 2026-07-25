import { create } from "zustand";
import { Order } from "../models/order";
interface OrderState{
    orders:Order[];
    addOrder:(
        order:Order
    )=>void;
    clear:()=>void;
}
export const userOrderStore=create<OrderState>(
    (set, get)=>({
        orders:[],
        addOrder:(order)=>
            set({
                orders:[
                    ...get().orders, order
                ]
            }),
        clear:()=>
            set({
                orders:[]
            })
    })
);