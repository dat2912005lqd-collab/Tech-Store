import React, {
    createContext, 
    useContext,
    useState
} from "react";

const LanguageContext=createContext<any>(null);
export function LanguageProvider({children}:{
    children:React.ReactNode
}){
    const[
        language, setLanguage
    ]=useState("vi");
    return(
        <LanguageContext.Provider
            value={{
                language, setLanguage
            }}>
                {children}
            </LanguageContext.Provider>
    );
}
export const useLanguageContext=()=>
    useContext(LanguageContext);