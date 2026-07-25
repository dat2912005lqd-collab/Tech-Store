export const QUERY_KEYS = {
    AUTH: {
        ME: ["auth", "me"] as const,
    },
    PRODUCTS: {
        LIST: (params: {
            limit: number;
            skip: number;
            sortBy?: string;
            order?: "asc" | "desc";
            filter?: Record<string, unknown>;
        }) => ["products", params] as const,
        DETAIL: (id: string | number) => ["product", id] as const,
        SEARCH: (query: string, category?: string) =>
            ["products", "search", { query, category }] as const,
    },
    USERS: {
        LIST: (params?: Record<string, unknown>) => ["users", params ?? {}] as const,
        DETAIL: (id: string | number) => ["user", id] as const,
    },
    CART: ["cart"] as const,
    COMMENT: {
        POST: (postId: string | number) => ["comment", "post", postId] as const,
    },
} as const;
export type QueryKey = readonly unknown[];