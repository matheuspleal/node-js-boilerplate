export default `#graphql
  input PaginationParams {
    offset: Int
    limit: Int
  }

  type FetchPersons {
    count: Int!
    persons: [Person!]!
  }

  type GetPersonById {
    person: Person
  }

  extend type Query {
    fetchPersons(params: PaginationParams): FetchPersons!
    getPersonById(id: ID!): GetPersonById
  }
`
