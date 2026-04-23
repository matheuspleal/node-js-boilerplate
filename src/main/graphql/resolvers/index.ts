import authentication from '@/main/graphql/resolvers/authentication.resolver'
import healthCheck from '@/main/graphql/resolvers/health-check.resolver'
import notification from '@/main/graphql/resolvers/notification.resolver'
import user from '@/main/graphql/resolvers/user.resolver'

export default [authentication, healthCheck, user, notification]
