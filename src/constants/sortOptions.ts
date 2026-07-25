export const SORT_FIELDS = ["price", "rating", "title"] as const;
export type SortField = typeof SORT_FIELDS[number];

export const SORT_ORDERS = ["asc", "desc"] as const;
export type SortOrder = typeof SORT_ORDERS[number];

export const SORT_OPTIONS = {
    PRICE_ASC: { field: "price" as const, order: "asc" as const },
    PRICE_DESC: { field: "price" as const, order: "desc" as const },
    RATING_DESC: { field: "rating" as const, order: "desc" as const },
    NAME_ASC: { field: "title" as const, order: "asc" as const },
} as const;

export type SortOptionKey = keyof typeof SORT_OPTIONS;
export type SortOption = typeof SORT_OPTIONS[SortOptionKey];