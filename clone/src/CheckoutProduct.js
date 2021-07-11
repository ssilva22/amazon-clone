import React from 'react'
import "../src/components/CheckoutProduct.css"
import { useStateValue } from './StateProvider'

function CheckoutProduct({id,image,title,price,rating, hideButton}) {

    const [{basket},dispatch] = useStateValue();

    const removeFromBasket= () => {
        //removes item from the basket
        dispatch({
            type: 'REMOVE_FROM_BASKET',
            id:id,
        })

    }
    return (
        <div className="checkoutProduct">
            <img className="checkoutProduct__image" src={image} alt="Checkout-Product-Image"/>

            <div className="checkoutProduct__info">
                <p className="checkoutProduct__title">{title}</p>

                <p className="checkcoutProduct__price">
                <small>$</small>
                <strong>{price}</strong>
                </p>
                <div className="checkoutProduct__rating">
                    {Array(rating).fill().map((_, i)=>(
                        <p>🌟</p>
                    ))}
                </div>
                {!hideButton && (
                    <button onClick={removeFromBasket}>Remove from Basket</button>
                 )}
            </div>
        </div>
    )
}


export default CheckoutProduct;
