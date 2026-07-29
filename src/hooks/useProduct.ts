
import { useEffect, useState} from "react";
import productService from "../services/productService"
import { Product } from "../models/product";

export const useProduct=(
    id:number
)=>{
    const[
        product, setProduct
    ]=useState<Product|null>(null);
    const[
        loading, setLoading
    ]=useState(false);

    useEffect(()=>
    {
        const load=async()=>{
            setLoading(true);
            const data= await productService.getById(id);
            setProduct(data);
            setLoading(false);
        }; 
        load();
    },[id]);

    return{
        product,loading
    };
};