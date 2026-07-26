class WishlistService{
    getWishlist(){
        return JSON.parse(
            localStorage.getItem("wishlist")||"[]"
        );
    }
    saveWishlist(products:number[]){
        localStorage.setItem(
            "wishlist", JSON.stringify(products));
    }
}
export default new WishlistService();