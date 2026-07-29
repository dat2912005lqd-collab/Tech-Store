import apiClient from "./apiClient";
import { Product } from "../models/product";
class ProductService{
    async getAll(limit=10,skip=0)
    {
        const response=await apiClient.get(
            `/products?limit=${limit}&skip=${skip}`
        );
        return response.data;
    }
    async getById(id:number){
        const response= await apiClient.get(
            '/product/${id}'
        );
        return response.data;
    }
    async search(keyword:string){
        const response=await apiClient.get(
            `/products/search?q=${keyword}`
        );
        return response.data;
    }
    async create(product:Product){
        return apiClient.post("/products/add",product);
    }
    async update(id:number,product:Product){
        return apiClient.put(`/products/${id}`);
    }
    async delete(id:number){
        return apiClient.delete(`/products/${id}`);
    }
}
export default new ProductService();