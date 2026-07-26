import React, {
    createContext, 
    useContext,
    useState
} from "react";

interface SessionContextType{
    expiresAt:number;
    refresh:()=>void;
}
const SessionContext=createContext<SessionContextType|null>(null);
export function SessionProvider({children}:{
    children:React.ReactNode
}){
    const[
        expiresAt,
        setExpiresAt
    ]=useState(Date.now());
    const refresh=()=>setExpiresAt(Date.now);
    return(
        <SessionContext.Provider
            value={{
                expiresAt, refresh
            }}>
                {children}
            </SessionContext.Provider>
    );
}
export const useSessionContext=()=>
    useContext(SessionContext)!;