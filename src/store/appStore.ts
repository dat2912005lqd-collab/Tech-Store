import { create } from "zustand";
interface AppState{
    theme:"light"|"dark";
    language:string;
    setTheme:(
        theme:"light"|"dark"
    )=>void;
    setLanguage:(
        language:string
    )=>void;
}
export const useAppStore= create<AppState>(
    (set)=>({
        theme:"light",
        language:"vi",
        setTheme:(theme)=>
            set({
                theme
            }),
        setLanguage:(language)=>
            set({
                language
            })
    })
);