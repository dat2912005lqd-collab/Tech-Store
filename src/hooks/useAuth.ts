import { useCallback } from "react";
import axiosClient from "../api/axios";
import { apiEndpoints } from "../constants/apiEndpoints";
import {
    clearAuthSession,
    getStoredRefreshToken,
    storeAuthTokens,
} from "../api/authInterceptor";

export interface LoginPayload {
    username: string;
    password: string;
    expiresInMins?: number;
}

export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    expiresInMins?: number;
}

const useAuth = () => {
    const login = useCallback(async (data: LoginPayload): Promise<AuthResult> => {
        const response = await axiosClient.post(apiEndpoints.AUTH.LOGIN, {
            username: data.username,
            password: data.password,
            ...(data.expiresInMins !== undefined ? { expiresInMins: data.expiresInMins } : {}),
        });

        const payload = response.data ?? {};

        if (typeof payload.accessToken !== "string" || typeof payload.refreshToken !== "string") {
            throw new Error("Invalid login response");
        }

        const authResult: AuthResult = {
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            expiresInMins:
                typeof payload.expiresInMins === "number" ? payload.expiresInMins : undefined,
        };

        storeAuthTokens(authResult.accessToken, authResult.refreshToken);
        return authResult;
    }, []);

    const logout = useCallback(() => {
        clearAuthSession();
        return true;
    }, []);

    const loadProfile = useCallback(async () => {
        const response = await axiosClient.get(apiEndpoints.AUTH.ME);
        return response.data;
    }, []);

    const refreshToken = useCallback(async (): Promise<AuthResult> => {
        const refreshTokenValue = getStoredRefreshToken();
        if (!refreshTokenValue) {
            clearAuthSession();
            throw new Error("Missing refresh token");
        }

        const response = await axiosClient.post(apiEndpoints.AUTH.REFRESH, {
            refreshToken: refreshTokenValue,
        });

        const payload = response.data ?? {};
        if (typeof payload.accessToken !== "string" || typeof payload.refreshToken !== "string") {
            throw new Error("Invalid refresh response");
        }

        const authResult: AuthResult = {
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            expiresInMins:
                typeof payload.expiresInMins === "number" ? payload.expiresInMins : undefined,
        };

        storeAuthTokens(authResult.accessToken, authResult.refreshToken);
        return authResult;
    }, []);

    return {
        login,
        logout,
        loadProfile,
        refreshToken,
    };
};

export default useAuth;