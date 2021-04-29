import Link from 'next/link';
import { useRouter } from 'next/router';
import Picture from '../common/picture';
import { formatDate } from '../../lib/utils';

function Book({ book, smallView, ownerView, deleteBook, purchasedView, soldView}) {
    const router = useRouter();
    return (
        <div className={`${smallView ? 'col-lg-4 col-sm-6' : 'col-lg-3 col-sm-6'} book-card`}>
            {purchasedView && <h5 className="small"> Purchased at : {formatDate(book.updatedAt)}</h5>}
            {soldView && <h5 className="small"> Sold at : {formatDate(book.updatedAt)}</h5>}
            <div className="card card-product">
                <Link href={`/books/${book.id}`} passHref>
                    <a style={{ textAlign: "center" }}>
                        <div className="card-header border-0">
                            <h2 className="h6">
                                {book.title}
                            </h2>
                        </div>
                        {/* <!-- Product image --> */}
                        <figure className="figure">
                            <Picture alt="Image placeholder" path={book.picture} className="img-center img-fluid" />
                        </figure>
                    </a>
                </Link>
                <div className="card-body">
                    {/* <!-- Price --> */}
                    <>
                        <span className="h6 mb-0">${book.price} USD</span>
                        <div className="badges">
                            {
                                book.category && book.category.map((cat, index) => {
                                    return (
                                        <span key={index} className="badge badge-info rounded-pill ml-1">{cat}</span>
                                    )
                                })
                            }
                        </div>
                    </>
                </div>
                {book.author &&
                    <div className="p-4 border-top">
                        <div className="row">
                            <div className="col-12 text-left">
                                <span className="h5 mb-0">Author :</span>
                                <span className="d-block text-sm">{book.author}</span>
                            </div>
                        </div>
                    </div>
                }
                {
                    ownerView &&
                    <div className="card-footer">
                        <div className="actions d-flex justify-content-between">
                            <button onClick={() => router.push(`/profile/editbook?id=${book.id}`)} className="btn btn-sm btn-info btn-icon rounded-pill"><i className="far fa-edit" ></i> edit</button>
                            <Link href={`/books/${book.id}`}><a className="btn btn-sm btn-info btn-icon rounded-pill"><i className="fas fa-paper-plane" ></i> view</a></Link>
                            <button
                                className="btn btn-sm btn-danger btn-icon rounded-pill"
                                onClick={() => deleteBook(book.id)}
                            >
                                <i className="fas fa-trash-alt" ></i>
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Book;