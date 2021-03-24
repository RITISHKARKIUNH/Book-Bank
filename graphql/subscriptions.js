/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview {
    onCreateReview {
      id
      isbn
      totalRating
      ratings
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview {
    onUpdateReview {
      id
      isbn
      totalRating
      ratings
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview {
    onDeleteReview {
      id
      isbn
      totalRating
      ratings
      createdAt
      updatedAt
    }
  }
`;
export const onCreateBook = /* GraphQL */ `
  subscription OnCreateBook($username: String) {
    onCreateBook(username: $username) {
      id
      title
      description
      author
      publication
      isbn
      category
      condition
      price
      picture
      username
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateBook = /* GraphQL */ `
  subscription OnUpdateBook($username: String) {
    onUpdateBook(username: $username) {
      id
      title
      description
      author
      publication
      isbn
      category
      condition
      price
      picture
      username
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteBook = /* GraphQL */ `
  subscription OnDeleteBook($username: String) {
    onDeleteBook(username: $username) {
      id
      title
      description
      author
      publication
      isbn
      category
      condition
      price
      picture
      username
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($id: String) {
    onCreateUser(id: $id) {
      id
      firstName
      lastName
      description
      phoneNumber
      image
      favoriteBooks {
        id
        title
        description
        author
        publication
        isbn
        category
        condition
        price
        picture
        username
        createdAt
        updatedAt
      }
      reviews {
        id
        isbn
        totalRating
        ratings
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($id: String) {
    onUpdateUser(id: $id) {
      id
      firstName
      lastName
      description
      phoneNumber
      image
      favoriteBooks {
        id
        title
        description
        author
        publication
        isbn
        category
        condition
        price
        picture
        username
        createdAt
        updatedAt
      }
      reviews {
        id
        isbn
        totalRating
        ratings
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($id: String) {
    onDeleteUser(id: $id) {
      id
      firstName
      lastName
      description
      phoneNumber
      image
      favoriteBooks {
        id
        title
        description
        author
        publication
        isbn
        category
        condition
        price
        picture
        username
        createdAt
        updatedAt
      }
      reviews {
        id
        isbn
        totalRating
        ratings
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
