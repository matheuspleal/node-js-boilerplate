import healthcheck from '@/main/graphql/resolvers/healthcheck-resolver'
import person from '@/main/graphql/resolvers/person-resolver'
import user from '@/main/graphql/resolvers/user-resolver'

export default [healthcheck, user, person]
