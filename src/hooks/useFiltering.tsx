import{
    useState
} from "react";
export const useFiltering=()=>{
    const [
        category, setCategory
    ]=useState("");
    return {
        category, setCategory,
        clear:()=> setCategory("")
    };
};