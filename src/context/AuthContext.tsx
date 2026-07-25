import { createContext } from "react";
export interface AuthProfile {
    id: string;
    username?: string;
    [key: string]: unknown;
}
export interface AuthContextValue {
    userProfile: AuthProfile | null;
    getUserProfile: () => AuthProfile | null;
    setUserProfile: (profile: AuthProfile) => void;
    clearUserProfile: () => void;
}
const AUTH_PROFILE_KEY = "techstore:v1:userProfile";
export const getUserProfile = (): AuthProfile | null => {
    const stored = localStorage.getItem(AUTH_PROFILE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored) as AuthProfile;
    } catch {
        return null;
    }
};
export const setUserProfile = (profile: AuthProfile): void => {
    localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
};
export const clearUserProfile = (): void => {
    localStorage.removeItem(AUTH_PROFILE_KEY);
};
const AuthContext = createContext<AuthContextValue>({
    userProfile: null,
    getUserProfile,
    setUserProfile: () => {},
    clearUserProfile: () => {},
});

export default AuthContext;