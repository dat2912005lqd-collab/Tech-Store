import apiClient from "../api/apiClient";
class AuthService{
    login(email: string, password: string) {
        return apiClient.post("/auth/login", { email, password });
    }
    refreshToken(refreshToken: string) {
        return apiClient.post("/auth/refresh-token", { refreshToken });
    }
    getMe(){
        return apiClient.get("/auth/me");
    }
    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
}
export default new AuthService();