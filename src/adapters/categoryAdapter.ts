import { Category } from "../model/category";
class CategoryAdapter{
    toModel(data:any):Category{
        return{
            slug:data.slug, 
            name:data.name,
            url:data.url   
        };
    }
}
export default new CategoryAdapter()