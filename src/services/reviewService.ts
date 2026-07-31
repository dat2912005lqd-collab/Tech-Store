import ProductService from "./productService";
class ReviewService{
    async getReviews(productId:number ){
        const product=await ProductService.getById(productId);
        return product.reviews;
    }
}
export default new ReviewService();