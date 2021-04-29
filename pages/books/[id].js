import { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import '../../configureAmplify';
import { getBook } from '../../graphql/queries';
import { Layout, StarRating, Toaster } from '../../components/common';
import { getUser, booksByUsername } from "../../graphql/queries";
import { updateUser } from '../../graphql/mutations';
import Picture from '../../components/common/picture';
import AddReview from '../../components/review/addReview';
import DisplayReviews from '../../components/review/displayReviews';
import { overallReviewsForBook } from '../../graphql/queries';
import { formatDate } from '../../lib/utils';

function BookDetail({ book, bookid, bookLoading }) {
    console.log(book, bookid, bookLoading);
    if (bookLoading) {
        return (
            <Layout>
                <section className="slice bg-section-secondary mt-6 mb-e text-center">
                    <h1>...Loading</h1>
                </section>
            </Layout>
        )
    }

    if (!book && !bookLoading) {
        return (
            <Layout>
                <section className="slice bg-section-secondary mt-6 mb-e text-center">
                    <h1>Book not found</h1>
                </section>
            </Layout>
        )
    }

    const [userID, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [addedByUser, setAddedByUser] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [addedTocart, setAddedToCart] = useState(false);
    const [processingFavorite, setProcessingFavorite] = useState(false);
    const [overAllReview, setOverAllReview] = useState(null);

    useEffect(() => {
        // check if saved in local storage before
        const favItems = JSON.parse(window.localStorage.getItem('favoriteList'));
        if (favItems && favItems.length > 0 && favItems.some(item => item.id === bookid) && userID) {
            setIsSaved(true);
        }

        // check if item is saved in cart before
        const cartItems = JSON.parse(window.localStorage.getItem('cart'));
        if (cartItems && cartItems.length > 0 && cartItems.some(item => item.id === bookid) && userID) {
            setAddedToCart(true);
        }

        checkUser();
        getBookRatings();
    }, []);

    async function getBookRatings() {
        const { isbn } = book;
        const bookData = await API.graphql({
            query: overallReviewsForBook, variables: { isbn }
        });

        const { items } = bookData.data.overallReviewsForBook;
        console.log(items);
        if (items && items.length > 0) {
            setOverAllReview(items[0]);
        }
    }

    async function checkUser() {
        try {
            let id = null;
            let userData = null;
            let listedBooks = null;
            let user = await Auth.currentAuthenticatedUser();
            setUserId(user.username);

            if (user && user.username) {
                id = user.username;
                userData = await API.graphql({
                    query: getUser, variables: { id }
                });

                listedBooks = await API.graphql({
                    query: booksByUsername, variables: { username: id }
                });

                user = { ...user, profile: userData.data.getUser, listedBooks }
                setUser(user);
            }

            if (user && user.listedBooks) {
                const books = user.listedBooks.data?.booksByUsername?.items;
                let items = JSON.parse(window.localStorage.getItem('favoriteList'));

                books.forEach(book => {
                    if (book.id === bookid) {
                        setAddedByUser(true);
                    }
                });

                if (user.profile && user.profile.favoriteBooks && user.profile.favoriteBooks.length > 0 && user.profile.favoriteBooks.some(item => item.id === bookid)) {
                    setIsSaved(true);
                }else{
                    setIsSaved(false);
                } 
            }

        } catch (err) {
            console.error(err);
            setAddedByUser(true);
        }
    }

    const savetoLocalStorage = (book) => {
        let items = JSON.parse(window.localStorage.getItem('favoriteList'));
        if (!items) {
            items = [];
        }

        if (userID) {
            const modifiedBook = { ...book, addedBy: userID };
            items.push(modifiedBook);
            window.localStorage.setItem('favoriteList', JSON.stringify(items));
            setIsSaved(true);
        }
    }

    const updateUserData = async (user) => {
        console.log(user);
        if (user.createdAt) delete user.createdAt;
        if (user.updatedAt) delete user.updatedAt;
        const res = await API.graphql({
            query: updateUser,
            variables: { input: user },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        });
        if (res && res.data) return res.data.updateUser;
    }

    const updateFavorite = async (book, isAdd) => {
        setProcessingFavorite(true);
        try {
            let updatedUser = user?.profile ? user.profile : null;
            let favList = updatedUser.favoriteBooks ? updatedUser.favoriteBooks : [];
            if (isAdd && (favList.length === 0 || !favList.some(item => item.id === book.id))) {
                let data = book;
                if (data.createdAt) delete data.createdAt;
                if (data.updatedAt) delete data.updatedAt;
                favList.push(data);
            } else if (favList.length > 0) {
                favList = favList.filter(item => item.id !== book.id);
            }

            updatedUser.favoriteBooks = favList;

            console.log("updated ?", updatedUser);
            let updatedProfile = await updateUserData(updatedUser);
            if (updatedProfile) {
                setUser({ ...user, profile: updatedProfile });
                checkUser();
            }
            Toaster(`Sucessfully ${isAdd ? 'added to' : 'removed from'} favorite list.`);
            setProcessingFavorite(false);
        } catch (err) {
            console.error(err);
            Toaster("Error updating favorite list", true);
            setProcessingFavorite(false);
        }
    }

    const addTocart = (book) => {
        let items = JSON.parse(window.localStorage.getItem('cart'));
        let isItemOnCart = false;
        if (!items) {
            items = [];
        }

        if (items && items.length > 0 && items.some(item => item.id === book.id)) {
            isItemOnCart = true;
        }

        if (!isItemOnCart) {
            items.push(book);
        }

        window.localStorage.setItem('cart', JSON.stringify(items));
        window.dispatchEvent(new Event("storage"));
        setAddedToCart(true);
    }

    const deleteFromCart = (book) => {
        let items = JSON.parse(window.localStorage.getItem('cart'));
        if (items && items.length > 0) {
            items = items.filter(item => item.id !== book.id);
        }
        window.localStorage.setItem('cart', JSON.stringify(items));
        window.dispatchEvent(new Event("storage"));
        setAddedToCart(false);
    }

    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    console.log(userID, addedByUser);

    return (
        <Layout>
            <div className="container mt-5">
                <div className="page-content">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    {/* <!-- Product title --> */}
                                    <h5 className="h4 text-capitalize">{book.title}</h5>
                                    {/* <h6 className="text-sm">{book.pageCount} Pages</h6> */}
                                    {/* <!-- Rating --> */}
                                    <div className="row align-items-center">
                                        <div className="col-sm-12">
                                            {`Added : ${formatDate(book.createdAt)}`}
                                        </div>
                                        <div className="col-sm-12">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <span className="badge badge-pill badge-soft-info">ISBN: {book.isbn}</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span className="badge badge-pill badge-soft-success">Condition : {book.condition}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* <!-- Description --> */}
                                    <div className="py-4 my-4 border-top">
                                        <h6 className="text-sm">Description:</h6>
                                        <ReactMarkdown className='prose' children={book.description} />
                                    </div>
                                    {
                                        book.author &&
                                        <div className="pt-4 mt-4 border-top">
                                            <h6 className="text-sm">Author :</h6>
                                            <p className="text-sm mb-0">{book.author}</p>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <DisplayReviews isbn={book.isbn} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            {/* <!-- Product images --> */}
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            {
                                                book.picture && <Picture style={{ height: "300px", width: "auto" }} path={book.picture} alt="book" className="img-fluid" />
                                            }
                                        </div>
                                        <div className="col">
                                            {/* add to categories */}
                                            {
                                                book.category && <div className="col-sm-12 mb-2">
                                                    <p><b>Categories :</b></p>
                                                    {
                                                        book.category.map(cat => {
                                                            return (
                                                                <span key={cat} className="badge badge-info ml-1">
                                                                    {cat}
                                                                </span>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            }
                                            <div className="col-sm-12 mb-2">
                                                <span className="h6"> Price : ${book.price}</span>
                                            </div>
                                            {
                                                overAllReview && <div style={{ flexWrap: "wrap" }} className="col-sm-12 d-flex align-items-center h6">
                                                    {
                                                        <StarRating
                                                            numberOfStars="5"
                                                            currentRating={overAllReview.totalRatingScore}
                                                        />
                                                    }
                                                    <span className="ml-1">{overAllReview.totalRatingScore}/5.0</span>
                                                    <div style={{ width: "100%" }} className="ml-1">{`${overAllReview.totalRating} total ${overAllReview.totalRating > 1 ? " Ratings" : " Rating"}`}</div>
                                                </div>
                                            }

                                            {
                                                !addedByUser &&
                                                <div className="col-sm-12 mt-5">
                                                    {/* <!-- Add to cart --> */}

                                                    {
                                                        !addedTocart &&
                                                        <button onClick={() => addTocart(book)} type="button" className="btn btn-info btn-icon btn-block">
                                                            <span className="btn-inner--icon"><i className="fas fa-shopping-cart"></i></span>
                                                            <span className="btn-inner--text">Add to cart</span>
                                                        </button>
                                                    }

                                                    {
                                                        addedTocart &&
                                                        <button onClick={() => deleteFromCart(book)} type="button" className="btn btn-info btn-icon btn-block">
                                                            <span className="btn-inner--icon"><i className="fas fa-shopping-cart"></i></span>
                                                            <span className="btn-inner--text">Delete from cart</span>
                                                        </button>
                                                    }

                                                    {
                                                        isSaved &&
                                                        <button disabled={processingFavorite} onClick={() => updateFavorite(book)} type="button" className="btn btn-danger btn-icon btn-block">
                                                            <span className="btn-inner--icon"><i className="fas fa-trash"></i></span>
                                                            <span className="btn-inner--text">{`${processingFavorite ? "Deleting" : "Delete"} from favorite`}</span>
                                                        </button>
                                                    }

                                                    {
                                                        !isSaved &&
                                                        <button disabled={processingFavorite} onClick={() => updateFavorite(book, true)} type="button" className="btn btn-success btn-icon btn-block">
                                                            <span className="btn-inner--icon"><i className="fas fa-bookmark"></i></span>
                                                            <span className="btn-inner--text">{`${processingFavorite ? "Saving" : "Save"} to favorite`}</span>
                                                        </button>
                                                    }
                                                </div>
                                            }
                                            {
                                                addedByUser && userID &&
                                                <div className="alert alert-info mt-5" role="alert">
                                                    Added by you
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {!addedByUser && userID &&
                                <AddReview userId={userID} user={user} overAllReview={overAllReview} isbn={book.isbn} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

// export async function getStaticPaths() {
//     const bookData = await API.graphql({
//         query: listBooks
//     })
//     const paths = bookData.data.listBooks.items.map(book => ({ params: { id: book.id } }))
//     return {
//         paths,
//         fallback: true
//     }
// }

BookDetail.getInitialProps = async ({ query }) => {
    const { id } = query;

    const bookData = await API.graphql({
        query: getBook, variables: { id }
    });
    console.log(id, bookData);

    return {
        book: bookData.data.getBook,
        bookid: id,
        bookLoading: bookData ? false : true
    }
}

export default BookDetail;