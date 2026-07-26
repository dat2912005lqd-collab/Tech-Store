import StorageUtil from "./storage";
const ACCESS_TOKEN="accessToken";
const REFRESH_TOKEN="refreshToken";
export const tokenUtil={
    getAccessToken(){
        return StorageUtil.get<string>(ACCESS_TOKEN);
    },
    setAccessToken(token:string){
        StorageUtil.set(ACCESS_TOKEN, token);
    },
    removeAccessToken(){
        StorageUtil.remove(ACCESS_TOKEN);
    },
    getRefreshToken(){
        return StorageUtil.get<string>(REFRESH_TOKEN);
    },
    setRefreshToken(token:string){
        StorageUtil.set(REFRESH_TOKEN,token);
    },
    removeRefreshToken(){
        StorageUtil.remove(REFRESH_TOKEN);
    }
};