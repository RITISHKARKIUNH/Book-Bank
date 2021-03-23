import { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { listBooks } from '../graphql/queries';
import { Layout, BannerCarousel } from '../components/common';
import Book from '../components/books/book';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    fetchPosts()
  }, []);

  async function fetchPosts() {
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
    setLoadingBooks(false);
  }

  return (
    <Layout>
      <BannerCarousel />
      <section className="bg-section-secondary">
        <div className="container">
          <h1> Recommended Books </h1>
          {
            loadingBooks && <h4> ...loading books </h4>
          }
          {
            !loadingBooks && books.length > 0 && <div className="row mt-4">
              {
                books.map((book) => {
                  return <Book key={book.id} book={book} />
                })
              }
            </div>
          }
          {
            !loadingBooks && books.length === 0 &&
            <div className="mt-3">
              <h4>There are no books in our platform to show currently. Be the first book seller in our platform</h4>
              <a href="/profile" className="btn btn-lg btn-primary rounded-pill hover-translate-y-n3 btn-icon d-none d-xl-inline-block scroll-me">
                <span className="btn-inner--icon"><i className="fas fa-book"></i></span>
                <span className="btn-inner--text">Add the first book</span>
              </a>
            </div>
          }
        </div>
      </section>
    </Layout>
  )
}