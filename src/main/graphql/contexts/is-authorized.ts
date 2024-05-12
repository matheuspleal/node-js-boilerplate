import { GraphQLError } from 'graphql'

import { type AuthContext } from '@/main/graphql/contexts/contracts/auth-context'

export function isAuthorized({ sub }: AuthContext) {
  if (!sub) {
    throw new GraphQLError('Unauthorized.', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    })
  }
}
