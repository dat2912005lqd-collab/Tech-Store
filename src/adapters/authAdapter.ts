import {
    LoginResponse
} from "../models/auth";
class AuthAdapter {
    toModel(data: any): LoginResponse {
        return {
            id: data.id,
            username: data.username,
            email: data.email,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        };
    }
}
export default new AuthAdapter();