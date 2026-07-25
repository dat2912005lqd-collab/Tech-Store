import apiClient from "../api/apiClient";
const login=(data:any)=>{
    return apiClient.post("/auth/login",data);
}
const me=()=>{
    return apiClient.get("/auth/me");
}
export default {
    login,
    me
}