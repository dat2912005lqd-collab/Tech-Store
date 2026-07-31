import React, {
    createContext, 
    useContext,
    useState, 
    ReactNode
} from "react";

interface SessionContextType{
    user:any|null;
    token:string|null;
    login:(user:any,token:string)=>void;
    logout:()=>void;
    expiresAt:number;
    refresh:()=>void;
}
const SessionContext = createContext<SessionContextType | undefined>(undefined);
export function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<number>(Date.now());
    const login = (userData: any, tokenData: string) => {
        setUser(userData);
        setToken(tokenData);
        setExpiresAt(Date.now() + 3600000); // 1 hour
    };
    const logout = () => {
        setUser(null);
        setToken(null);
    };
    const refresh = () => setExpiresAt(Date.now() + 3600000);
    const value: SessionContextType = {
        user,token,login,logout,expiresAt,refresh
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSessionContext must be used within a SessionProvider');
    }
    return context;
};
