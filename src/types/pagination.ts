export interface PaginationRequest{
    page:number;
    pageSize:number;
}
export interface PaginationResponse<T>{
    items:T[];
    totalItems:number;
    totalPages:number;
    currentPage:number;
    pageSize:number;
}
export interface PaginationState{
    page:number;
    pageSize:number;
    totalItems:number;
}