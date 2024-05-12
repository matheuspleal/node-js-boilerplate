export default `#graphql
  type Healthcheck {
    message: String!
  }

   extend type Query {
    healthcheck: Healthcheck!
  }
`
