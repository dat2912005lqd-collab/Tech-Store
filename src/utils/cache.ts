export const cacheUtil={
    save<T>(
        key:string, value:T
    )
    {
        sessionStorage.setItem(
            key,JSON.stringify(value)
        );
    },
    load<T>(key:string):T | null{
        const value=sessionStorage.getItem(key);
        return value
        ?JSON.parse(value)
        :null;
    },
    clear(){
        sessionStorage.clear();
    }
}