import { useState, useEffect } from 'react';
import { listBooks } from '../../graphql/queries';
import { API, Storage } from 'aws-amplify';
import Link from 'next/link';

function SearchItem({ book }) {
    return (
        <Link href={`/books/${book.id}`} passHref>
            <a className="list-group-item">
                <div className="media">
                    <img className="rounded" style={{ width: "30px", height: "30px" }} src={book.picture} alt={book.title} />
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

    useEffect(() =>{
        fetchBooks();
    },[])

    async function fetchBooks() {
        const bookData = await API.graphql({
          query: listBooks
        });
    
        const { items } = bookData.data.listBooks;
        // Fetch images from S3 for posts that contain a cover image
        const booksWithImages = await Promise.all(items.map(async book => {
          if (book.picture) {
            book.picture = await Storage.get(book.picture)
          }
          return book;
        }));
        setBooks(booksWithImages);
        setBookLoading(false);
      }

    //tallying the books title with search queries to filter the products
    useEffect(() => {
        let filtered = [];
        books.forEach(book => {
            const containsTitle = book.title.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0;
            const containsCategory = book.category.some(category => category.toLowerCase().includes(searchQuery.toLowerCase())) && searchQuery.length > 0;
            const containsAuthor = book.author.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0;
            
            //if any of the above flags is true add to the filtered book list
            if ( containsAuthor || containsCategory || containsTitle ) {
                filtered.push(book)
            }
        });
        setFilteredBooks(filtered);
    }, [searchQuery]);

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
                            <h3> No book found with title {searchQuery} </h3>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
export default SearchBar;