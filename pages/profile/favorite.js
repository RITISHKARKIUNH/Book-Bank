import WithProfileLayout from '../../hoc/withprofilelayout';
import { useState, useEffect } from 'react';
import Book from '../../components/books/book';

function FavoriteBooks({ user }) {
    console.log(user);
    if (!user) return null;
    const [favBooks, setFavBooks] = useState([]);

    useEffect(() => {
        const favList = user?.profile?.favoriteBooks ? user.profile.favoriteBooks : [];
        setFavBooks(favList);
    }, [user]);

    return (
        <>
            <div className="page-content">
                <div className="page-title">
                    <h1 className="text-3xl font-semibold tracking-wide mt-2 mb-3 text-white">Favorite Book List</h1>
                </div>
                <div className="container">
                    {
                        (!favBooks || favBooks.length === 0) && <h4 className="text-white"> You have no books in your favorite list </h4>
                    }
                    {
                        favBooks && favBooks.length > 0 &&
                        <div className="row">
                            {
                                favBooks.map((book) => {
                                    return (
                                        <Book key={book.id} book={book} smallView={true} ownerView={false} deleteBook={(id) => deleteBook(id)} onEditBook={(id) => onEditBook(id)} />
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default WithProfileLayout(FavoriteBooks);