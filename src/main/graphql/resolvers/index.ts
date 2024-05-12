import authentication from '@/main/graphql/resolvers/authentication-resolver'
import healthcheck from '@/main/graphql/resolvers/healthcheck-resolver'
import user from '@/main/graphql/resolvers/user-resolver'

export default [healthcheck, authentication, user]
