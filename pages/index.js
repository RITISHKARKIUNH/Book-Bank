import { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { availableBooks } from '../graphql/queries';
import { Layout, BannerCarousel } from '../components/common';
import Book from '../components/books/book';
import { getUser } from "../graphql/queries";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [user, setUser] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
    checkUser();
  }, []);

  useEffect(() => {
    let recommended = [];
    let featured = [];
    if (user && books) {
      console.log(user, books);
      const interests = user?.profile?.interest ? user.profile.interest : [];
      if (interests.length > 0) {
        books.forEach(book => {
          const bookCat = book.category;
          const intersection = bookCat.filter(cat => interests.includes(cat));
          if (intersection && intersection.length > 0) {
            recommended.push(book);
          } else {
            featured.push(book);
          }
        });
      }
    }

    if (recommended.length > 0) setRecommendedBooks(recommended);
    if (featured.length > 0) setFeaturedBooks(featured);

  }, [user, books]);

  async function checkUser() {
    try {
      let user = await Auth.currentAuthenticatedUser();
      const id = user.username;
      const userData = await API.graphql({
        query: getUser, variables: { id }
      });

      if (userData) {
        user = { ...user, profile: userData.data.getUser }
      }

      setUser(user);
    } catch (err) {
      setUser(null);
    }
  }

  async function fetchBooks() {
    try {
      const bookData = await API.graphql({
        query: availableBooks, variables: { availability: 'available' }
      });

      const { items } = bookData.data.availableBooks;
      setBooks(items);
      setLoadingBooks(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Layout>
      <BannerCarousel />
      <section className="bg-section-secondary">
        <div className="container">
          {
            loadingBooks && <h4> ...loading books </h4>
          }
          {
            !loadingBooks && books.length > 0 && recommendedBooks.length === 0 && featuredBooks.length === 0 &&
            <div className="row">
              {
                <>
                  <h1 className="col-md-12"> Featured Books </h1>
                  {
                    books.map((book) => {
                      return <Book key={book.id} book={book} />
                    })
                  }
                </>
              }
            </div>
          }
          {
            !loadingBooks && featuredBooks.length > 0 &&
            <div className="row">
              {
                <>
                  <h1 className="col-md-12"> Featured Books </h1>
                  {
                    featuredBooks.map((book) => {
                      return <Book key={book.id} book={book} />
                    })
                  }
                </>
              }
            </div>
          }
          {
            !loadingBooks && recommendedBooks.length > 0 &&
            <div className="row mt-5 mb-4">
              {
                <>
                  <h1 className="col-md-12"> Recommended Books </h1>
                  {
                    recommendedBooks.map((book) => {
                      return <Book key={book.id} book={book} />
                    })
                  }
                </>
              }
            </div>
          }
          {
            !loadingBooks && books.length === 0 && recommendedBooks.length === 0 && featuredBooks.length === 0 &&
            <div className="mt-3">
              <h4>There are no books in our platform to show currently. Be the first book seller in our platform</h4>
              <a href="/profile/addbook" className="btn btn-lg btn-primary rounded-pill hover-translate-y-n3 btn-icon d-none d-xl-inline-block scroll-me">
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