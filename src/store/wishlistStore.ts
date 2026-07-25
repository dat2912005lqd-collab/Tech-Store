import { create } from "zustand";
interface WishlistState{
    productIds:number[];
    add:(id:number)=>void;
    remove:(id:number)=>void;
    clear:()=>void;
}
export const useWishlistStore=create<WishlistState>(
    (set, get)=>({
        productIds:[],
        add:(id)=>
            set({
                productIds:[
                    ...get().productIds,id
                ]
            }),
        remove:(id)=>
            set({
                productIds:get().productIds.filter(
                    p=>p!==id
                )
            }),
        clear:()=>
            set({
                productIds:[]
            })
    })
);