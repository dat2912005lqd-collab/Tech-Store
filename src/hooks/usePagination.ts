import {useState} from "react";
import {
    calculateSkip,
    calculateTotalPages
} from "../utils/pagination";
export const usePagination=(pageSize=10)=>{
    const [page, setPage]=useState(1);
    const [totalItems,setTotalItems]=useState(0);
    const totalPages=calculateTotalPages(
        totalItems,
        pageSize
    );
    const skip= calculateSkip(page,pageSize);
    const nextPage=() =>{
        if(page<totalPages)
        {
            setPage(page+1);
        }
    };
    const previousPage=()=>{
        if(page>1)
        {
            setPage(page-1);
        }
    };
    return {
        page,
        pageSize,
        skip,
        totalItems,
        totalPages,
        setTotalItems,
        nextPage,
        previousPage,
        goToPage
    };
};