import {
    useState
} from "react";
export const useLoading=()=>{
    const[
        loading, setLoading
    ]= useState(false);
    return{
        loading,
        start:()=> setLoading(true),
        stop:()=> setLoading(false)
    };
};