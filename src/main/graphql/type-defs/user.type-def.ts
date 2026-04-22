export default `#graphql
  input PaginationParams {
    number: Int
    size: Int
  }

  type FetchUsers {
    count: Int!
    users: [User!]!
  }

  type GetUserById {
    user: User
  }

  extend type Query {
    fetchUsers(params: PaginationParams): FetchUsers!
    getUserById(id: ID!): GetUserById
  }
`
