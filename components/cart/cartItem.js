import { Picture } from '../common';
import { deleteFromCart } from '../../lib/utils';

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

export default CartItem;