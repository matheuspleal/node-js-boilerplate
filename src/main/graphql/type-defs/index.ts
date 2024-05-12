import authentication from '@/main/graphql/type-defs/authentication-type-def'
import base from '@/main/graphql/type-defs/base-type-def'
import healthcheck from '@/main/graphql/type-defs/healthcheck-type-def'
import user from '@/main/graphql/type-defs/user-type-def'

export default [base, healthcheck, authentication, user]
