export const apiEndpoints={
    AUTH:{
        LOGIN:"auth/login",
        REFRESH:"/auth/refresh",
        ME:"/auth/me"
    },
    PRODUCT:{
        LIST:"/product",
        DETAIL: (id: string | number) => `/products/${encodeURIComponent(String(id))}`,
        SEARCH: (keyword: string) => `/products/search?query=${encodeURIComponent(keyword)}`,
    },
    PROFILE: "/profile",
    CART: "/cart",
    USER: "/users",
};