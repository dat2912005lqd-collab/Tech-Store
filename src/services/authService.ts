import apiClient from "../api/apiClients";
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
export const register = async (userData: any) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default new AuthService();