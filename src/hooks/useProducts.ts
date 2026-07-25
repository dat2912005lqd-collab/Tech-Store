import { useCallback } from "react";
import axiosClient from "../api/axios";
import { apiEndpoints } from "../constants/apiEndpoints";

export interface ProductPayload {
    [key: string]: unknown;
}

const useProducts = () => {
    const loadProducts = useCallback(
        async (params?: {
            limit?: number;
            skip?: number;
            sortBy?: string;
            order?: "asc" | "desc";
            filter?: Record<string, unknown>;
        }) => {
            const searchParams = new URLSearchParams();

            if (params?.limit !== undefined) {
                searchParams.set("limit", String(params.limit));
            }
            if (params?.skip !== undefined) {
                searchParams.set("skip", String(params.skip));
            }
            if (params?.sortBy) {
                searchParams.set("sortBy", params.sortBy);
            }
            if (params?.order) {
                searchParams.set("order", params.order);
            }
            if (params?.filter) {
                searchParams.set("filter", JSON.stringify(params.filter));
            }

            const query = searchParams.toString();
            const response = await axiosClient.get(
                `${apiEndpoints.PRODUCT.LIST}${query ? `?${query}` : ""}`
            );

            return response.data;
        },
        []
    );

    const loadProductById = useCallback(async (id: number | string) => {
        const response = await axiosClient.get(apiEndpoints.PRODUCT.DETAIL(id));
        return response.data;
    }, []);

    const createProduct = useCallback(async (product: ProductPayload) => {
        const response = await axiosClient.post(apiEndpoints.PRODUCT.LIST, product);
        return response.data;
    }, []);

    const updateProduct = useCallback(async (id: number | string, product: ProductPayload) => {
        const response = await axiosClient.put(apiEndpoints.PRODUCT.DETAIL(id), product);
        return response.data;
    }, []);

    const deleteProduct = useCallback(async (id: number | string) => {
        const response = await axiosClient.delete(apiEndpoints.PRODUCT.DETAIL(id));
        return response.data;
    }, []);

    return {
        loadProducts,
        loadProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};

export default useProducts;