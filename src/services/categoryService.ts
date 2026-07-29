import apiClient from "./apiClient";
class CategoryService {
    async getAll() {
        const response=await apiClient.get("products/categories");
        return response.data;
    }
}
export default new CategoryService();