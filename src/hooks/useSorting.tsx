import React from 'react';
import{
    useState
} from "react";

export const useSorting=()=>{
    const[
        order, setOrder
    ]=useState<"asc"|"desc">("asc");
    
    return{
        order, setOrder
    };
};