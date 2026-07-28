export interface Category{
    id:string;
    slug:string;
    name:string;
    description?:string;
    icon?:string;
    image?:string;
    url:string;
}
export interface RawCategoryResponse{
    id?: string| number;
    name?:string;
    slug?:string;
    description?:string;
    image?:string;
}