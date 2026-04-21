export default `#graphql
  type Notification {
    id: ID!
    recipientId: String!
    title: String!
    content: String!
    readAt: Date
    createdAt: Date!
  }

  type FetchNotificationsByRecipient {
    count: Int!
    notifications: [Notification!]!
  }

  type ReadNotification {
    notification: Notification
  }

  extend type Query {
    fetchNotificationsByRecipient(recipientId: ID!): FetchNotificationsByRecipient!
  }

  extend type Mutation {
    readNotification(id: ID!): ReadNotification
  }
`
