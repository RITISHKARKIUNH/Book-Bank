/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
      id
      isbn
      totalRating
      totalRatingScore
      createdAt
      updatedAt
    }
  }
`;
export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
      id
      isbn
      totalRating
      totalRatingScore
      createdAt
      updatedAt
    }
  }
`;
export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
      id
      isbn
      totalRating
      totalRatingScore
      createdAt
      updatedAt
    }
  }
`;
export const createBook = /* GraphQL */ `
  mutation CreateBook(
    $input: CreateBookInput!
    $condition: ModelBookConditionInput
  ) {
    createBook(input: $input, condition: $condition) {
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
export const updateBook = /* GraphQL */ `
  mutation UpdateBook(
    $input: UpdateBookInput!
    $condition: ModelBookConditionInput
  ) {
    updateBook(input: $input, condition: $condition) {
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
export const deleteBook = /* GraphQL */ `
  mutation DeleteBook(
    $input: DeleteBookInput!
    $condition: ModelBookConditionInput
  ) {
    deleteBook(input: $input, condition: $condition) {
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
export const createUserRating = /* GraphQL */ `
  mutation CreateUserRating(
    $input: CreateUserRatingInput!
    $condition: ModelUserRatingConditionInput
  ) {
    createUserRating(input: $input, condition: $condition) {
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
export const updateUserRating = /* GraphQL */ `
  mutation UpdateUserRating(
    $input: UpdateUserRatingInput!
    $condition: ModelUserRatingConditionInput
  ) {
    updateUserRating(input: $input, condition: $condition) {
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
export const deleteUserRating = /* GraphQL */ `
  mutation DeleteUserRating(
    $input: DeleteUserRatingInput!
    $condition: ModelUserRatingConditionInput
  ) {
    deleteUserRating(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      description
      phoneNumber
      image
      createdAt
      updatedAt
      favoriteBooks {
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
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      description
      phoneNumber
      image
      createdAt
      updatedAt
      favoriteBooks {
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
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      description
      phoneNumber
      image
      createdAt
      updatedAt
      favoriteBooks {
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
  }
`;
