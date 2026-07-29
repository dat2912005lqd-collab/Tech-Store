import { Category } from "../models/category";
class CategoryAdapter{
    toModel(data:any):Category{
        return{
            id:data.id,
            slug:data.slug, 
            name:data.name,
            url:data.url   
        };
    }
}
export default new CategoryAdapter()