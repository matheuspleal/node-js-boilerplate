import gql from 'graphql-tag'

export default gql`
  type Token {
    token: String!
  }

  type CreateUser {
    user: User
  }

  extend type Query {
    signIn(email: String!, password: String!): Token!
  }

  extend type Mutation {
    signUp(
      name: String!
      email: String!
      password: String!
      birthdate: Date!
    ): CreateUser!
  }
`
