import apiClient from "../api/apiClients";
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