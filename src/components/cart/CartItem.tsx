import React from 'react';
import {CartProduct} from "../../models/carts";

interface Props{
    item:CartProduct;
}

function CartItem({
    item
}:Props){
    return (
        <div className="cart-item">
            <h4>
                {item.title}
            </h4>
            <p>
                Quantity:{item.quantity}
            </p>
            <p>
                ${item.price}
            </p>
        </div>
    );
}
export default CartItem;
