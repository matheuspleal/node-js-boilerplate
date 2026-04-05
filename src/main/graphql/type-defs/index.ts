import authentication from '@/main/graphql/type-defs/authentication.type-def'
import base from '@/main/graphql/type-defs/base.type-def'
import healthCheck from '@/main/graphql/type-defs/health-check.type-def'
import user from '@/main/graphql/type-defs/user.type-def'

export default [base, healthCheck, authentication, user]
