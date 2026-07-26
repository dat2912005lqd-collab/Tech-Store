import React from 'react';
import { Product } from "../../models/product";

interface Props {
    product: Product;
}

function ProductCard({
    product
}: Props) {
    return (
        <div className="product-card">
            <img
                src={product.thumbnail}
                alt={product.title}
            />
            <h3>
                {product.title}
            </h3>
            <p>
                ${product.price}
            </p>
            <p>
                {product.rating}
            </p>
        </div>
    );
}
export default ProductCard;