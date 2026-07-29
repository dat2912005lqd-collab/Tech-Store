
class ReviewService{
    async getReviews(productId:number ){
        const product=await productService.getById(productId);
        return product.reviews;
    }
}