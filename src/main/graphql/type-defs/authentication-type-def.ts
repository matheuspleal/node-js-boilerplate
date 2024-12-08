export default `#graphql
  type Token {
    accessToken: String!
  }

  type CreatedUser {
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
    ): CreatedUser!
  }
`
