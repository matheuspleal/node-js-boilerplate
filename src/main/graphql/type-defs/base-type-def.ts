export default `#graphql
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String!
    birthdate: Date!
    createdAt: Date!
    updatedAt: Date!
  }

  type Person {
    id: ID!
    name: String!
    birthdate: Date!
    age: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`
