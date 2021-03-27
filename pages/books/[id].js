import { useState, useEffect } from 'react';
import { API, Storage, Auth } from 'aws-amplify'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import '../../configureAmplify'
import { listBooks, getBook } from '../../graphql/queries'
import { Layout } from '../../components/common';
import { getUser, booksByUsername } from "../../graphql/queries";
import Picture from '../../components/common/picture';

export default function BookDetail({ book, bookid }) {
    if (!book) {
        return (
            <Layout>
                <section className="slice bg-section-secondary mt-6 mb-e text-center">
                    <h1>Book not found</h1>
                </section>
            </Layout>
        )
    }

    const [userID, setUserId] = useState(null);
    const [addedByUser, setAddedByUser] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // check if saved in local storage before
        let items = JSON.parse(window.localStorage.getItem('favoriteList'));
        if (items && items.length > 0 && items.some(item => item.id === book.id)) {
            setIsSaved(true);
        }

        checkUser();
    }, []);

    async function checkUser() {
        try {
            let id = null;
            let userData = null;
            let listedBooks = null;
            let user = await Auth.currentAuthenticatedUser();

            if (user && user.attributes.sub) {
                id = user.attributes.sub;
                setUserId(user.attributes.sub);
                userData = await API.graphql({
                    query: getUser, variables: { id }
                });

                listedBooks = await API.graphql({
                    query: booksByUsername, variables: { username: id }
                });

                user = { ...user, profile: userData.data.getUser, listedBooks }
            }

            if (user && user.listedBooks) {
                const books = user.listedBooks.data?.booksByUsername?.items;
                books.forEach(book => {
                    if (book.id === bookid) {
                        setAddedByUser(true);
                    }
                });
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
        console.log(userID);
        if (userID) {
            const modifiedBook = { ...book, addedBy: userID };
            items.push(modifiedBook);
            window.localStorage.setItem('favoriteList', JSON.stringify(items));
            setIsSaved(true);
        }
    }

    const removeFromLocalStorage = (book) => {
        let items = JSON.parse(window.localStorage.getItem('favoriteList'));

        if (items && items.length > 0) {
            items = items.filter(item => item.id !== book.id);
        }
        window.localStorage.setItem('favoriteList', JSON.stringify(items));
        setIsSaved(false);
    }

    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>
    }

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
                                        <div className="col-sm-6">
                                            {/* <span className="static-rating static-rating-sm d-block">
                                                <i className="star far fa-star voted"></i>
                                                <i className="star far fa-star voted"></i>
                                                <i className="star far fa-star voted"></i>
                                                <i className="star far fa-star voted"></i>
                                                <i className="star far fa-star"></i>
                                            </span> */}
                                        </div>
                                        <div className="col-sm-6 text-sm-right">
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
                                            {/* <div className="col-sm-12 d-flex h6">
                                                <span className="static-rating static-rating-sm d-block mr-2">
                                                    <i className="star far fa-star voted"></i>
                                                    <i className="star far fa-star voted"></i>
                                                    <i className="star far fa-star voted"></i>
                                                    <i className="star far fa-star voted"></i>
                                                    <i className="star far fa-star"></i>
                                                </span>
                                                4,563 Ratings
                                            </div> */}
                                            {
                                                !addedByUser &&
                                                <div className="col-sm-12 mt-5">
                                                    {/* <!-- Add to cart --> */}
                                                    {
                                                        isSaved &&
                                                        <button onClick={() => removeFromLocalStorage(book)} type="button" className="btn btn-danger btn-icon btn-block">
                                                            <span className="btn-inner--icon"><i className="fas fa-trash"></i></span>
                                                            <span className="btn-inner--text">Delete from favorite</span>
                                                        </button>
                                                    }
                                                    {
                                                        !isSaved &&
                                                        <button onClick={() => savetoLocalStorage(book)} type="button" className="btn btn-success btn-icon btn-block">
                                                            <span className="btn-inner--icon"><i className="fas fa-bookmark"></i></span>
                                                            <span className="btn-inner--text">Save to favorite</span>
                                                        </button>
                                                    }
                                                </div>
                                            }
                                            {
                                                addedByUser && userID && 
                                                <div class="alert alert-info mt-5" role="alert">
                                                    Added by you
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    const bookData = await API.graphql({
        query: listBooks
    })
    const paths = bookData.data.listBooks.items.map(book => ({ params: { id: book.id } }))
    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    const { id } = params;

    const bookData = await API.graphql({
        query: getBook, variables: { id }
    });

    return {
        props: {
            book: bookData.data.getBook,
            bookid: id
        }
    }
}
