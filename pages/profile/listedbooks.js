import { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { booksBoughtByUsername, booksByUsername } from '../../graphql/queries';
import { deleteBook as deleteBookMutation } from '../../graphql/mutations';
import Book from '../../components/books/book';
import WithProfileLayout from '../../hoc/withprofilelayout';
import { Input } from '../../components/common'
import Select from 'react-select';
import { selectStyle } from './addbook';
import { sortArrayOfObjectsByField } from '../../lib/utils';
const options = [
    { "label": "title", "value": "title" },
    { "label": "category", "value": "category" },
    { "label": "author", "value": "author" }
];

function ListedBooks({ user }) {
    if (!user) return null;
    const [availableBooks, setAvailableBooks] = useState([]);
    const [booksLoading, setAvailableBooksLoading] = useState(true);
    const [boughtBooks, setBoughtBooks] = useState([]);
    const [boughtBooksLoading, setBoughtBooksLoading] = useState(true);
    const [soldBooks, setSoldBooks] = useState([]);
    const [soldBooksLoading, setSoldBooksLoading] = useState(true);
    const [filterValue, setFilterValue] = useState(options[0]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [ascending, setAscending] = useState(false);
    const [query, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    function onChange(e) {
        const value = e.target.value;
        const filtered = []
        setSearchQuery(value);
        if (value.length > 0) {
            if (filterValue.label === 'title') {
                availableBooks.forEach(book => {
                    const containsTitle = book.title.toLowerCase().includes(value.toLowerCase());
                    if (containsTitle) {
                        filtered.push(book)
                    }
                });
            } else if (filterValue.label === 'category') {
                availableBooks.forEach(book => {
                    const containsCategory = book.category.some(category => category.toLowerCase().includes(value.toLowerCase()));
                    if (containsCategory) {
                        filtered.push(book)
                    }
                });
            } else {
                availableBooks.forEach(book => {
                    const containsAuthor = book.author.toLowerCase().includes(value.toLowerCase());
                    if (containsAuthor) {
                        filtered.push(book)
                    }
                });
            }

            setFilteredBooks(filtered);
        } else {
            setFilteredBooks([]);
        }
    }

    async function fetchBooks() {
        const { username } = user;
        let availableBooks = [];
        let unAvailableBooks = [];

        const booksData = await API.graphql({
            query: booksByUsername, variables: { username: username }
        });

        if (booksData && booksData.data.booksByUsername && booksData.data.booksByUsername.items && booksData.data.booksByUsername.items.length > 0) {
            booksData.data.booksByUsername.items.forEach(item => {
                if (item.availability === "Not available") {
                    unAvailableBooks.push(item);
                } else {
                    availableBooks.push(item);
                }
            })
        }

        const boughtBooksData = await API.graphql({
            query: booksBoughtByUsername, variables: { boughtBy: username }
        });

        setAvailableBooks(availableBooks);
        setAvailableBooksLoading(false);

        setBoughtBooks(boughtBooksData.data.booksBoughtByUsername.items);
        setBoughtBooksLoading(false);

        setSoldBooks(unAvailableBooks);
        setSoldBooksLoading(false);
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

    function handleFilterChange(newValue, actionMeta) {
        setFilteredBooks([]);
        setSearchQuery('');
        setFilterValue(newValue);
    }

    function toggleAscending() {
        const value = !ascending;
        const array = filteredBooks.length > 0 ? filteredBooks : availableBooks;
        setAscending(value);
        const sorted = sortArrayOfObjectsByField(array, 'price', value, true);
        if (filteredBooks.length > 0) {
            setFilteredBooks(sorted);
        } else {
            setAvailableBooks(sorted);
        }
    }

    if (availableBooks.length === 0 && boughtBooks.length === 0 && soldBooks.length === 0 && !booksLoading) {
        return (
            <>
                <div className="page-content">
                    <div className="page-title">
                        <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">You dont have any listed availableBooks in our platform.</h1>
                    </div>
                    <div className="container">
                        <a href="/profile/addbook" className="btn  btn-lg btn-info btn-icon rounded-pill">add a new book</a>
                    </div>
                </div>
            </>
        )
    }

    console.log(boughtBooks);

    return (
        <>
            <div className="page-content">
                {availableBooks.length > 0 &&
                    <>
                        <div className="page-title">
                            <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Listed Books</h1>
                        </div>

                        <div className="container mt-3 mb-5">
                            <div className="row">

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <Input
                                                type="text"
                                                onChange={onChange}
                                                name="publication"
                                                placeholder={`Book ${filterValue.label}`}
                                                value={query}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <Select
                                        className="bookbank-select"
                                        onChange={handleFilterChange}
                                        options={options}
                                        value={filterValue}
                                        placeholder="Select Filter"
                                        required
                                        styles={selectStyle}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <button className="btn btn-secondary" onClick={() => toggleAscending()}>
                                        Price
                                {ascending ? ' ascending' : ' descending'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                }
                <div className="container">
                    <div className="row">
                        {
                            query.length === 0 && filteredBooks.length === 0 && availableBooks.map((book) => {
                                return (
                                    <Book key={book.id} book={book} smallView={true} ownerView={true} deleteBook={(id) => deleteBook(id)} onEditBook={(id) => onEditBook(id)} />
                                )
                            })
                        }
                        {
                            query.length > 0 && filteredBooks.length > 0 && filteredBooks.map((book) => {
                                return (
                                    <Book key={book.id} book={book} smallView={true} ownerView={true} deleteBook={(id) => deleteBook(id)} onEditBook={(id) => onEditBook(id)} />
                                )
                            })
                        }
                        {
                            query.length > 0 && filteredBooks.length === 0 && <h2 className="text-white">Could not find the listed book whose {filterValue.label} matches {query}</h2>
                        }
                        {
                            !boughtBooksLoading && boughtBooks.length > 0 &&
                            <div className={`col-lg-12 ${availableBooks.length === 0 && filteredBooks.length === 0 ? 'bg-white' : ''}`}>
                                <hr className="mt-3 mb-3" />
                                <div className="row">
                                    <h1 className="col-lg-12 mb-3">Books Bought</h1>
                                    {
                                        boughtBooks.map(book => {
                                            return <Book key={book.id} book={book} smallView={true} purchasedView={true} />
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            !soldBooksLoading && soldBooks.length > 0 &&
                            <div className={`col-lg-12 ${availableBooks.length === 0 && filteredBooks.length === 0 && boughtBooks.length === 0 ? 'bg-white' : ''}`}>
                                <hr className="mt-3 mb-3" />
                                <div className="row">
                                    <h1 className="col-lg-12 mb-3">Books Sold</h1>
                                    {
                                        soldBooks.map(book => {
                                            return <Book key={book.id} book={book} smallView={true} soldView={true} />
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default WithProfileLayout(ListedBooks);