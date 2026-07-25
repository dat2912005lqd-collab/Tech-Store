export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    id: number;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}