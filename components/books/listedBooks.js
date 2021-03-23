// pages/my-books.js
import { useState, useEffect } from 'react';
import { API, Auth, Storage } from 'aws-amplify';
import { booksByUsername } from '../../graphql/queries';
import { deleteBook as deleteBookMutation } from '../../graphql/mutations';
import Book from './book';

export default function ListedBooks() {
    const [books, setBooks] = useState([]);

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

    if (books.length === 0) {
        return (
            <div>
                <h1> You have not listed any books in our platform</h1>
            </div>
        )
    }

    return (
        <div className="page-content">
            <div className="page-title">
                <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2 text-white">Listed Books</h1>
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
    )
}