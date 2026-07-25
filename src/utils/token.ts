class Token
{
    get()
    {
        return localStorage.getItem("access_token");
    }
    remove()
    {
        localStorage.removeItem("access_token");
    }
    getToken(){}
    setToken(){}
    removeToken(){}
    getRefreshToken(){}
    setRefreshToken(){}
}