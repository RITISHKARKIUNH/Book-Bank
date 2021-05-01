import { useState, useEffect } from 'react';
import { availableBooks } from '../../graphql/queries';
import { Picture } from '../common';
import { a, API, Storage } from 'aws-amplify';
import Link from 'next/link';

function SearchItem({ book }) {
    return (
        <Link href={`/books/${book.id}`} passHref>
            <a className="list-group-item">
                <div className="media">
                    <Picture className="rounded" style={{ width: "30px", height: "30px" }} path={book.picture} alt={book.title}/>
                    <div className="media-body ml-3">
                        <p className="mb-0 h6 text-sm">{book.title}</p>
                    </div>
                </div>
            </a>
        </Link>
    );
}

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFoucsed] = useState(false);
    const [books, setBooks] = useState([]);
    const [bookLoading, setBookLoading] = useState(true);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [allFilter, setAllFilter] = useState(true);
    const [titleFilter, setTitleFilter] = useState(false);
    const [authorFilter, setAuthorFilter] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, [])

    async function fetchBooks() {
        const bookData = await API.graphql({
            query: availableBooks, variables: { availability: 'available' }
        });
        const { items } = bookData.data.availableBooks;
        setBooks(items);
        setBookLoading(false);
    }

    //tallying the books title with search queries to filter the products
    useEffect(() => {
        let filtered = [];
        books.forEach(book => {
            const containsTitle = book.title.toLowerCase().startsWith(searchQuery.toLowerCase()) && searchQuery.length > 0;
            const containsCategory = book.category.some(category => category.toLowerCase().startsWith(searchQuery.toLowerCase())) && searchQuery.length > 0;
            const containsAuthor = book.author.toLowerCase().startsWith(searchQuery.toLowerCase()) && searchQuery.length > 0;

            //if any of the above flags is true add to the filtered book list
            if (allFilter && (containsAuthor || containsCategory || containsTitle)) {
                console.log('all');
                filtered.push(book);
            } else if (categoryFilter && containsCategory) {
                console.log('category');
                filtered.push(book);
            } else if (titleFilter && containsTitle) {
                console.log('title');
                filtered.push(book);
            } else if (authorFilter && containsAuthor) {
                console.log('author');
                filtered.push(book);
            }
        });
        setFilteredBooks(filtered);
    }, [searchQuery, allFilter, categoryFilter, titleFilter, authorFilter]);

    function handleFilterChange(e, name) {
        switch (name) {
            case 'all':
                if (e.currentTarget.checked) {
                    setTitleFilter(false);
                    setAuthorFilter(false);
                    setCategoryFilter(false);
                    setAllFilter(e.currentTarget.checked);
                }
                break;
            case 'title':
                setTitleFilter(e.currentTarget.checked);
                if (!e.currentTarget.checked && !categoryFilter && !authorFilter) {
                    setAllFilter(true);
                } else {
                    setAllFilter(false);
                }
                break;
            case 'author':
                setAuthorFilter(e.currentTarget.checked);
                if (!e.currentTarget.checked && !categoryFilter && !titleFilter) {
                    setAllFilter(true);
                } else {
                    setAllFilter(false);
                }
                break;
            case 'category':
                setCategoryFilter(e.currentTarget.checked);
                if (!e.currentTarget.checked && !titleFilter && !authorFilter) {
                    setAllFilter(true);
                } else {
                    setAllFilter(false);
                }
                break;
            default:
                break;
        }
    }

    return (
        <div className={`position-relative`}>
            <div style={{ width: "500px" }} className={`form-group mb-0 search-bar ${searchFocused ? 'focused' : ''}`}>
                <div className="input-group input-group-merge">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-search"></i></span>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFoucsed(true)}
                        onBlur={() => setSearchFoucsed(false)}
                        className="form-control"
                        id="input-email"
                        placeholder="Search Books"
                    />
                    <span className="position-relative advanced-options ml-3">
                        <button className="btn btn-primary shadow-lg">Options </button>
                        <div className="search-options">
                            <div className="custom-control custom-checkbox">
                                <input
                                    checked={allFilter}
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="serachByAll"
                                    onChange={(e) => handleFilterChange(e, 'all')}
                                />
                                <label className="custom-control-label" htmlFor="serachByAll">Include all</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input
                                    checked={titleFilter} type="checkbox"
                                    className="custom-control-input"
                                    id="serachByTitle"
                                    onChange={(e) => handleFilterChange(e, 'title')}
                                />
                                <label className="custom-control-label" htmlFor="serachByTitle">Search by title</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input
                                    checked={authorFilter}
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="searchByAuthor"
                                    onChange={(e) => handleFilterChange(e, 'author')}
                                />
                                <label className="custom-control-label" htmlFor="searchByAuthor">Search by author</label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input
                                    checked={categoryFilter}
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="searchByCategory"
                                    onChange={(e) => handleFilterChange(e, 'category')}
                                />
                                <label className="custom-control-label" htmlFor="searchByCategory">Search by category</label>
                            </div>
                        </div>
                    </span>
                </div>
            </div>

            {/* items withh be shown if they are in filtered list */}
            {
                filteredBooks.length > 0 &&
                <div className="search-suggestions">
                    <div className="list-group list-group-flush">
                        {
                            filteredBooks.map((book, index) => {
                                return (
                                    <SearchItem key={book.isbn + index} book={book} />
                                );
                            })
                        }
                    </div>
                </div>
            }

            {/* items withh be shown if they are in filtered list */}
            {
                filteredBooks.length === 0 && searchQuery.length > 0 && !bookLoading &&
                <div className="search-suggestions">
                    <div className="list-group list-group-flush">
                        <div className="list-group-item">
                            <h3> Book not found with {allFilter && 'details'} {categoryFilter && 'category'} {authorFilter && 'author'} {titleFilter && 'title'} "{searchQuery}" </h3>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
export default SearchBar;