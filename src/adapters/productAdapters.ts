class ProductAdapters{
    toModel(data:any):Product{
        return{
            id:data.id,
            title:data.title,
            description:data.description,
            category:data.category,
            price:data.price,
            discountPercentage:data.discountPercentage,
            rating:data.rating,
            stock:data.stock,
            brand:data.brand,
            thumbnail:data.thumbnail,
            images:data.images, 
            reviews:data.reviews ?? []
        };
    }
    toDTO(product:Product)
    {
        return{
            title:product.title,
            description:product.description,
            category:product.category,
            price:product.price,
            stock:product.stock
        };
    }
calculateSalePrice(product:Product):number{
    return Number(
        (
            product.price -
            product.price *
            product.discountPercentage /100
            ).toFixed(2)
        );
    }
}
export default new ProductAdapters();