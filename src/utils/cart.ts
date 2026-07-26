import {
    CartProduct
} from "../models/carts";
export const CartUtil = {
    total(
        items: CartProduct[]
    ) {
        return items.reduce(
            (sum, item) =>
                sum +item.price *item.quantity, 0
        );
    },
    quantity(
        items: CartProduct[]
    ) {
        return items.reduce(
            (sum, item) =>
                sum +
                item.quantity,0
        );
    }
};