import apiClient from "./apiClient";
class UserService {
    async getAll(){
        const response=await apiClient.get("/users");
        return response.data;
    }
    async getById(id: number) {
        const response=await apiClient.get("/users/${id}");
        return response.data;
    } 
}
export default new UserService();