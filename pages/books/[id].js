import { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import '../../configureAmplify'
import { listBooks, getBook } from '../../graphql/queries'
import { Layout } from '../../components/common';

export default function BookDetail({ book }) {

    if (!book) {
        return (
            <Layout>
                <section className="slice bg-section-secondary mt-6 mb-e text-center">
                    <h1>Book not found</h1>
                </section>
            </Layout>
        )
    }

    const [picture, setPicture] = useState(null);

    useEffect(() => {
        updateCoverImage();
    }, []);

    async function updateCoverImage() {
        if (book.picture) {
            const imageKey = await Storage.get(book.picture);
            setPicture(imageKey);
        }
    }

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // check if saved in local storage before
        let items = JSON.parse(window.localStorage.getItem('favoriteList'));
        if (items.some(item => item.isbn === book.isbn)) {
            setIsSaved(true);
        }
    });

    const savetoLocalStorage = (book) => {
        let items = JSON.parse(window.localStorage.getItem('favoriteList'));
        if (!items) {
            items = [];
        }
        items.push(book);
        window.localStorage.setItem('favoriteList', JSON.stringify(items));
        setIsSaved(true);
    }

    const removeFromLocalStorage = (book) => {
        let items = JSON.parse(window.localStorage.getItem('favoriteList'));

        if (items && items.length > 0) {
            items = items.filter(item => item.isbn !== book.isbn);
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
                                        book.authors &&
                                        <div className="pt-4 mt-4 border-top">
                                            <h6 className="text-sm">{book.authors.length > 1 ? "Authors " : "Author "}:</h6>
                                            {
                                                book.authors.map(author => {
                                                    return <p key={author} className="text-sm mb-0">{author}</p>
                                                })
                                            }
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
                                            <img style={{ height: "300px", width: "auto" }} alt="Image placeholder" src={picture} className="img-fluid" />
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

                                                <button type="button" className="btn btn-primary btn-icon btn-block">
                                                    <span className="btn-inner--icon"><i className="fas fa-shopping-cart"></i></span>
                                                    <span className="btn-inner--text">Add to cart</span>
                                                </button>
                                            </div>
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
            book: bookData.data.getBook
        }
    }
}
