import axiosClient from "./axios";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const storeAuthTokens = (
    accessToken: string,
    refreshToken: string
) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getStoredAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getStoredRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearAuthSession = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default axiosClient;