import apiClient from "./apiClient";
class CartService {
    async getCart(id:number) {
        const response =await apiClient.get(`/cart/${id}`);
        return response.data;
    }
    async addProduct(cart: any) {
        return apiClient.post("/carts/add",cart);
    }
    update(id: number, cart: any) {
        return apiClient.put("/carts/${id}",cart);
    }
}
export default new CartService();