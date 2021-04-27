/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview {
    onCreateReview {
      id
      isbn
      totalRating
      totalRatingScore
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
      totalRatingScore
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
      totalRatingScore
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
      availability
      boughtBy
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
      availability
      boughtBy
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
      availability
      boughtBy
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserRating = /* GraphQL */ `
  subscription OnCreateUserRating($username: String) {
    onCreateUserRating(username: $username) {
      id
      score
      isbn
      description
      picture
      username
      title
      profile
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUserRating = /* GraphQL */ `
  subscription OnUpdateUserRating($username: String) {
    onUpdateUserRating(username: $username) {
      id
      score
      isbn
      description
      picture
      username
      title
      profile
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserRating = /* GraphQL */ `
  subscription OnDeleteUserRating($username: String) {
    onDeleteUserRating(username: $username) {
      id
      score
      isbn
      description
      picture
      username
      title
      profile
      name
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      addedBooks {
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      soldBooks {
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      boughtBooks {
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
        availability
        boughtBy
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      addedBooks {
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      soldBooks {
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      boughtBooks {
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
        availability
        boughtBy
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      addedBooks {
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      soldBooks {
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      boughtBooks {
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
        availability
        boughtBy
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
