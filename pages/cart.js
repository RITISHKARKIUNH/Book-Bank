import { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { Layout, Picture } from '../components/common';
import { deleteFromCart } from '../lib/utils';

function CartItem({ book }) {
    return (
        <div className="row mb-4">
            <div className="col-md-5 col-lg-3 col-xl-3">
                <div className="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">
                    <Picture path={book.picture} alt={book.title} className="img-fluid w-100" />
                </div>
            </div>
            <div className="col-md-7 col-lg-9 col-xl-9">
                <div>
                    <div className="d-flex justify-content-between">
                        <div>
                            <h4>{book.title}</h4>
                            <p className="mb-1 text-muted ">Isbn : {book.isbn}</p>
                            <p className="mb-1 text-muted ">Author : {book.author}</p>
                            <p className="mb-1 text-muted ">Condition : {book.condition}</p>
                            <p className="mb-1 text-muted ">Publication : {book.publication}</p>
                            <p className="mb-1 text-muted ">Categories : {book.category.map((cat, index) => `${cat}${index === book.category.length - 1 ? '' : ', '}`)}</p>
                        </div>
                        <div>
                            <h5>Quantity : 1 </h5>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span
                                type="button"
                                className="card-link-secondary small text-uppercase text-danger text-warning mr-3"
                                onClick={() => {
                                    deleteFromCart(book);
                                }}
                            >
                                <i className="fas fa-trash-alt mr-1"></i> Remove item
                            </span>
                            <span type="button" className="card-link-secondary small text-primary text-uppercase">
                                <i className="fas fa-heart mr-1"></i> Add to Favorite
                            </span>
                        </div>
                        <p className="mb-0"><span><strong>${book.price}</strong></span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

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
                                            <>
                                                <CartItem book={item} key={item.id} />
                                                {index !== cartItems.length - 1 && <hr className="mb-4" />}
                                            </>
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
                                <h5 className="mb-3 text-uppercase">Order Summary</h5>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0 mb-3">
                                        Estimated Total
                                        <span>${totalPrice} USD</span>
                                    </li>
                                </ul>

                                <button type="button" className="btn btn-primary btn-block waves-effect waves-light">Proceed to checkout</button>
                                <a href="/" type="button" className="btn btn-primary btn-block waves-effect waves-light">Continue Browsing</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )

}

export default Cart;