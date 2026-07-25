export const calculateSkip = (
    page:number,
    pageSize:number
): number =>{
return  (page-1)*pageSize;
};
export const calculateTotalPages=(
    totalItems:number,
    pageSize:number
):number =>{
    return Math.ceil(totalItems/pageSize)
};
export const normalizePage=(
    page:number, 
    totalPages:number
): number =>{
    if (page<1) return 1;
    if (page> totalPages) return totalPages;
return page
};
export const hasNextPage=(
    page:number,
    totalPages:number
):boolean=>{
    return page<totalPages;
};
export const hasPreviousPage=(
    page:number
):boolean =>{
    return page>1;
};