import React from 'react';
import ProductCard from "./ProductCard";
import { Product } from "../../models/product";

interface Props {
    products: Product[];
}
function ProductGrid({
    products
}: Props) {
    return (
        <div className="product-grid">
            {
                products.map(product => (
                    <ProductCard
                        product={product}
                    />
                ))
            }
        </div>
    );
}
export default ProductGrid;