import React, { useEffect, useState } from "react"
import "./components/Payment.css"
import CheckoutProduct from "./CheckoutProduct";
import { useStateValue } from "./StateProvider";
import {Link, useHistory} from "react-router-dom"
import { CardElement,useElements, useStripe } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios"
import {db} from "./firebase"



function Payment() {
    const [{basket,user},dispatch] = useStateValue();
    const history = useHistory();

    const stripe = useStripe();
    const elements= useElements();
    
    const [succeeded,setSucceeded] = useState();
    const [processing,setProcessing]= useState();
    const [error,setError] = useState(null);
    const [disabled,setDisabled] = useState(true);
    const [clientSecret,setClientSecret]= useState(true);

    useEffect(()=>{
        //generate special stripe secret that allows us to charge the customer
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                //Stripe expects the total amount in currencies subunits
                url: `/payments/create?total=${getBasketTotal(basket)*100}`
            });
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    },[basket])

    const handleSubmit= async (e) => {
        // do all the fancy stripe stuff
        e.preventDefault();
        setProcessing(true);

        const payload= await stripe.confirmCardPayment(clientSecret,{
            payment_method : {
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent})=>{
            //paymentIntent = payment confirmation

            db.collection('users')
            .doc(user?.id)
            .collection('orders')
            .doc(paymentIntent.uid)
            .set({
                basket:basket,
                amount:paymentIntent.created,
                created: paymentIntent.created
            })

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            });

            history.replace('/orders')
        })
    }

    const handleChange= events => {
        //Listens for changes in the card element
        //displays any error as the customer types their credit card details
        setDisabled(events.empty);
        setError(events.error ? events.error.message : "")

    }

    return (
        <div className="payment">
           <div className="payment__container">
           <h1>
               Checkout (<Link to="/checkout">{basket?.length} items</Link>)
           </h1>
               {/*Payment Section-delivery address*/}
               <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Miami,Fl</p>
                    </div>
               </div>
                {/*Payment Section-Review Items*/}
                <div className="payment__section">
                    <div className="payment__title">
                    <h3>Review items and delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map(item => (
                           <CheckoutProduct 
                               id={item.id}
                               title={item.title}
                               image={item.image}
                               price={item.price}
                               rating={item.rating}
                           /> 
                        ))}
                    </div>
                   </div>
                 {/*Payment Section-Payment Method*/}
                 <div className="payment__section">
                   <div className="payment__title">
                            <h3>Payment Method</h3>
                   </div>
                   <div className="payment__details">
                            <form onSubmit={handleSubmit}>
                               <CardElement onChange={handleChange}/> 

                               <div className="payment__priceContainer">
                                   <CurrencyFormat 
                                   renderText={(value)=>(
                                       <>
                                       <h3>Order Total: {value}</h3>
                                       </>
                                   )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}   
                                   />
                                   <button disabled={processing || disabled || succeeded}>
                                       <span>{processing ? <p>Processing</p>: "Buy Now"}</span>
                                   </button>
                               </div>

                               {/*Errors */}
                               {error && <div>{error}</div>}
                            </form>
                   </div>
                   </div>
           </div> 
        </div>
    )

}

export default Payment;