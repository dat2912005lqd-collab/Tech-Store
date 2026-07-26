import React, {
    createContext, 
    useContext, 
    useState
} from "react";
import App from "../App";

interface AppContextType{
    loading:boolean;
    setLoading:(value:boolean)
    =>void;
}

 const AppContext=createContext<AppContextType|null>(null);
 export function AppProvider({
    children
 }:{
    children:React.ReactNode
 }){
    const[
        loading, setLoading
  ]=useState(false);
    return(
        <AppContext.Provider
            value={{
                loading, 
                setLoading
            }}
            >
                {children}
            </AppContext.Provider>
    );
 };
 export const useAppContext=()=>{
    return useContext(AppContext)!;
 }