import authentication from '@/main/graphql/resolvers/authentication-resolver'
import healthCheck from '@/main/graphql/resolvers/health-check-resolver'
import person from '@/main/graphql/resolvers/person-resolver'

export default [authentication, healthCheck, person]
