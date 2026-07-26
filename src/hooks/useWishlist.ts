import {
    useWishlistStore
} from "../store/wishlistStore";
export const useWishlist=()=>{
    return useWishlistStore();
}