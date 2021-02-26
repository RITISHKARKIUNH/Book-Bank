import { Layout, BannerCarousel } from '../components/common';
import React, { useState } from 'react';
import { getSampleBooks } from '../lib/mock-data';
import Book from '../components/books/book';

export default function Home() {
  const [books, setBooks] = useState(getSampleBooks().slice(1, 101));
  return (
    <Layout>
      <BannerCarousel />
      <section className="slice bg-section-secondary">
        <div className="container">
          <h1> Recommended Books </h1>
          <div className="row">
            {
              books.slice(0,8).map((book, index) =>{
                return <Book key={book.isbn + index} book={book} />
              })
            }
          </div>
          {books.length}
        </div>
      </section>
    </Layout>
  )
}
