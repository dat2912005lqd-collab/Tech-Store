import API from "./endpoints";
export class EndpointMapper {
    public static getProductUrl(id?: string | number): string {
        return id === undefined ? API.PRODUCTS : `${API.PRODUCTS}/${encodeURIComponent(String(id))}`;
    }
    public static getUserUrl(id?: string | number): string {
        return id === undefined ? API.USERS : `${API.USERS}/${encodeURIComponent(String(id))}`;
    }
    public static getCartUrl(id?: string | number): string {
        return id === undefined ? API.CART : `${API.CART}/${encodeURIComponent(String(id))}`;
    }
    public static getCommentUrl(id?: string | number): string {
        return id === undefined ? API.COMMENTS : `${API.COMMENTS}/${encodeURIComponent(String(id))}`;
    }
}
export default EndpointMapper;