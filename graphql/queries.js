/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
      id
      isbn
      totalRating
      totalRatingScore
      createdAt
      updatedAt
    }
  }
`;
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isbn
        totalRating
        totalRatingScore
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const overallReviewsForBook = /* GraphQL */ `
  query OverallReviewsForBook(
    $isbn: String
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    overallReviewsForBook(
      isbn: $isbn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        isbn
        totalRating
        totalRatingScore
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getBook = /* GraphQL */ `
  query GetBook($id: ID!) {
    getBook(id: $id) {
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
export const listBooks = /* GraphQL */ `
  query ListBooks(
    $filter: ModelBookFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const booksByUsername = /* GraphQL */ `
  query BooksByUsername(
    $username: String
    $sortDirection: ModelSortDirection
    $filter: ModelBookFilterInput
    $limit: Int
    $nextToken: String
  ) {
    booksByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const booksBoughtByUsername = /* GraphQL */ `
  query BooksBoughtByUsername(
    $username: String
    $boughtBy: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBookFilterInput
    $limit: Int
    $nextToken: String
  ) {
    booksBoughtByUsername(
      username: $username
      boughtBy: $boughtBy
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getUserRating = /* GraphQL */ `
  query GetUserRating($id: ID!) {
    getUserRating(id: $id) {
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
export const listUserRatings = /* GraphQL */ `
  query ListUserRatings(
    $filter: ModelUserRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserRatings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const reviewsByUser = /* GraphQL */ `
  query ReviewsByUser(
    $username: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByUser(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const reviewsByIsbn = /* GraphQL */ `
  query ReviewsByIsbn(
    $isbn: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByIsbn(
      isbn: $isbn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
