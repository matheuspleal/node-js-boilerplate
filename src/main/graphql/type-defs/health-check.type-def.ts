export default `#graphql
  type HealthCheck {
    message: String!
  }

   extend type Query {
    healthCheck: HealthCheck!
  }
`
