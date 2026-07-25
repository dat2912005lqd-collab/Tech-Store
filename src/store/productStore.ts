import { create } from "zustand";
import { Product } from "../models/product";
interface ProductState{
    products:Product[];
    selectedProduct?:Product;
    loading:boolean;
    setProducts:(
        products:Product[]
    )=>void;
    setSelectedProduct:(
        product:Product
    )=>void;
    setLoading:(
        loading:boolean
    )=>void;
    clear:()=>void;
}
export const useProductStore=create<ProductState>(
    (set)=>({
        products:[],
        loading:false,
        setProducts:(products)=>
            set({
                products
            }),
        setSelectedProduct:(selectedProduct)=>
            set({
                selectedProduct
            }),
        setLoading:(loading)=>
            set({
                loading
            }),
        clear:()=>
            set({
                products:[], selectedProduct:undefined
            })
    })
);