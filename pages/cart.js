import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Toaster } from '../components/common';
import { Layout } from '../components/common';
import CartItem from '../components/cart/cartItem';
const stripePromise = loadStripe('pk_test_51Ikb4cFIMPr1Z4G8kXTNrJwdkkckrY33bhjm6DMpjMa50Re9nAGZsP12JwGbJMlBdkxYkR7JKQENgmwNJGwSpvo500uzcJT6X5');

const CheckoutForm = ({ cart, totalPrice, onPaymentSuccess }) => {
    const [processingPayment, setProcessingPayment] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async event => {
        event.preventDefault();
        setProcessingPayment(true);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });

        console.log(error);

        if (!error) {
            const { id } = paymentMethod;
            const body = {
                "id": id,
                "amount": totalPrice * 100,
                "lineItems": cart
            };


            console.log(body, totalPrice, typeof (totalPrice));
            try {
                const response = await fetch('api/cart', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: "POST",
                    body: JSON.stringify(body)
                });
                if (response.status === 200) {
                    onPaymentSuccess(response);
                    Toaster('Payment Sucessfully Processed');
                }
                setProcessingPayment(false);
            } catch (error) {
                console.log(error);
                Toaster('Payment Not Processed', true);
                setProcessingPayment(false);
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ width: "100%" }}
        >
            <h5 className="mb-3 text-uppercase">Card Details</h5>

            <CardElement />
            <button type="submit" disabled={processingPayment} className="btn btn-primary btn-block waves-effect waves-light mt-3" disabled={!stripe}>
                {processingPayment ? 'Processing Payment' : 'Pay Now'}
            </button>
        </form>
    );
};

function StripeWrapper({ cart, totalPrice, ononPaymentSuccess }) {
    const [status, setStatus] = useState("ready");
    if (status === "success") {
        return <div>Purchase success!</div>;
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                cart={cart}
                totalPrice={totalPrice}
                onPaymentSuccess={(response) => {
                    setStatus("success");
                    ononPaymentSuccess(response);
                }}
            />
        </Elements>
    );
}


function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [displayCheckout, setDisplayCheckout] = useState(false);
    const [paymentResponse, setPaymentResponse] = useState(null);

    useEffect(() => {
        checkInitialData();
        cartListener();
        window.addEventListener("storage", cartListener);
        return () => window.removeEventListener("storage", cartListener);
    }, []);

    const cartListener = () => {
        let items = JSON.parse(window.localStorage.getItem('cart'));
        let totalPrice = 0;
        if (items) {
            setCartItems(items);
            if (items.length > 0) {
                items.forEach(item => {
                    totalPrice += parseFloat(item.price);
                });
            }
        }
        setTotalPrice(totalPrice);
    }

    const checkInitialData = async () => {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
    }

    const onPaymentSuccess = (response) => {
        console.log(response);
        setPaymentResponse(response);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event("storage"));
    }


    if (paymentResponse) {
        return (
            <Layout>
                <div className="container mt-5">
                    <div className="page-content">
                        <div className="row">
                            <div className="card col">
                                <div className="card-body">
                                    <h1> You have succesfully purchased folowing items</h1>
                                    <a href="/" type="button" className="btn btn-primary btn-lg waves-effect waves-light">Continue Browsing</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <Layout>
                <div className="container mt-5">
                    <div className="page-content">
                        <div className="row">
                            <div className="card col">
                                <div className="card-body">
                                    <h1> No items in cart </h1>
                                    <a href="/" type="button" className="btn btn-primary btn-lg waves-effect waves-light">Continue Browsing</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!user) {
        return (
            <Layout>
                <div className="container mt-5">
                    <div className="page-content">
                        <div className="row">
                            <div className="card">
                                <h1> Page not found </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <section className="container mt-3">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card wish-list mb-3">
                            <div className="card-body">
                                <h5 className="mb-4">Cart (<span>{cartItems.length}</span> {cartItems.length > 1 ? 'Items' : 'Item'})</h5>
                                {
                                    cartItems.map((item, index) => {
                                        return (
                                            <div key={item.id}>
                                                <CartItem book={item} />
                                                {index !== cartItems.length - 1 && <hr className="mb-4" />}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="mb-4">We accept</h5>
                                <img className="mr-2" width="45px"
                                    src="https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                                    alt="Visa" />
                                <img className="mr-2" width="45px"
                                    src="https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                                    alt="American Express" />
                                <img className="mr-2" width="45px"
                                    src="https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                                    alt="Mastercard" />
                            </div>
                        </div>

                        <div className="card mb-3">
                            <div className="card-body">
                                {!displayCheckout &&
                                    <>
                                        <h5 className="mb-3 text-uppercase">Order Summary</h5>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 mb-3">
                                                Estimated Total
                                                <span>${totalPrice} USD</span>
                                            </li>
                                        </ul>
                                        <button onClick={() => setDisplayCheckout(true)} type="button" className="btn btn-primary btn-block waves-effect waves-light">Proceed to checkout</button>
                                        <a href="/" type="button" className="btn btn-primary btn-block waves-effect waves-light">Continue Browsing</a>
                                    </>
                                }
                                {displayCheckout && <StripeWrapper cart={cartItems} totalPrice={totalPrice} ononPaymentSuccess={res => onPaymentSuccess(res)} />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )

}

export default Cart;