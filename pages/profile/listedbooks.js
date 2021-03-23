import ProfileLayout from "../../components/profile/profileLayout";
import { useState, useEffect } from 'react';
import { API, Auth, Storage } from 'aws-amplify';
import { booksByUsername } from '../../graphql/queries';
import { deleteBook as deleteBookMutation } from '../../graphql/mutations';
import Book from '../../components/books/book';

function Profile() {
    const [books, setBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        const { username } = await Auth.currentAuthenticatedUser();
        const bookData = await API.graphql({
            query: booksByUsername, variables: { username }
        });

        const { items } = bookData.data.booksByUsername;
        // Fetch images from S3 for posts that contain a cover image
        const booksWithImages = await Promise.all(items.map(async book => {
            if (book.picture) {
                book.picture = await Storage.get(book.picture)
            }
            return book;
        }));
        setBooks(booksWithImages);
        setBooksLoading(false);
    }

    async function deleteBook(id) {
        await API.graphql({
            query: deleteBookMutation,
            variables: { input: { id } },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        });

        fetchBooks();
    }

    function onEditBook(id) {
        onEditBook(id);
    }

    if (books.length === 0 && !booksLoading) {
        return (
            <ProfileLayout>
                <div className="page-content">
                    <div className="page-title">
                        <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">You dont have any listed books in our platform.</h1>
                    </div>
                    <div className="container">
                        <a href="/profile/addbook" className="btn  btn-lg btn-primary btn-icon rounded-pill">add a new book</a>
                    </div>
                </div>
            </ProfileLayout>
        )
    }

    return (
        <ProfileLayout>
            <div className="page-content">
                <div className="page-title">
                    <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Listed Books</h1>
                </div>
                <div className="container">
                    <div className="row">
                        {
                            books.map((book) => {
                                return (
                                    <Book key={book.id} book={book} smallView={true} ownerView={true} deleteBook={(id) => deleteBook(id)} onEditBook={(id) => onEditBook(id)} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </ProfileLayout>
    )
}

export default Profile;