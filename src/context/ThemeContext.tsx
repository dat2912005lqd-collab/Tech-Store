import React, {
    createContext,
    useContext,
    useState
} from "react";

type Theme = "light" | "dark";

const ThemeContext=createContext<any>(null);
export function ThemeProvider({children}:
    {children:React.ReactNode})
    {const[
        theme, setTheme
    ]=useState<Theme>("light");
    return (
        <ThemeContext.Provider
            value={{
                theme, setTheme
            }}>
                {children}
            </ThemeContext.Provider>
    );
    }
export const useThemeContext=()=>
    useContext(ThemeContext)
