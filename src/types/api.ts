export interface ApiResponse<T>{
    success:boolean;
    message?:string;
    data:T;
}
export interface ApiError{
    status:number;
    message:string;
    errors?:Record<string, string[]>;
}
export interface RequestOptions{
    signal?:AbortSignal;
    headers?:Record<string,string>;
} 
export interface ListResponse<T>{
    products?:T[];
    users?:T[];
    carts?:T[];
    total:number;
    skip:number;
    limit:number;
}