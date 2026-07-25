import { useCallback } from "react";
const STORAGE_NAMESPACE="techstore:v1";
export interface CacheApi{
    save:<T>(key:string, value:T)=>void;
    load:<T>(key:string,fallback?:T)=>T|null;
    remove:(key:string)=>void;
    clear:()=>void;
}
const useCache= (): CacheApi =>{
    const save=useCallback(<T,>(key:string,value:T)=>{
        try{
            localStorage.setItem(`${STORAGE_NAMESPACE}:${key}`, JSON.stringify(value));
        } catch {
            // ignore storage errors
        }
    }, []);

    const load = useCallback(<T,>(key: string, fallback?: T): T | null => {
        try {
            const raw = localStorage.getItem(`${STORAGE_NAMESPACE}:${key}`);
            if (!raw) {
                return fallback ?? null;
            }

            return JSON.parse(raw) as T;
        }
    catch{
        return fallback ??null;
    }
},[])
const remove=useCallback(( key:string)=>{
    localStorage.removeItem(`${STORAGE_NAMESPACE}:${key}`);
    }, []);
const clear=useCallback(()=>{
    const prefix = `${STORAGE_NAMESPACE}:`;
        Object.keys(localStorage)
            .filter((key) => key.startsWith(prefix))
            .forEach((key) => localStorage.removeItem(key));
    }, []);
return {save, load, remove,clear};
};
export default useCache;