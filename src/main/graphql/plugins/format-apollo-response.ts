import {
  type ApolloServerPlugin,
  type GraphQLRequestContextWillSendResponse,
} from '@apollo/server'

import { type AuthContext } from '@/main/graphql/contexts/contracts/auth-context'
import { setStatusCodeFromGraphQLCode } from '@/main/graphql/helpers/set-status-code-from-graphql-code'
import { parseJSONSafe } from '@/main/helpers/parse-json-safe'

export const formatApolloResponse: ApolloServerPlugin<AuthContext> = {
  async requestDidStart() {
    return {
      async willSendResponse({
        response,
      }: GraphQLRequestContextWillSendResponse<AuthContext>) {
        const { body } = response
        if (body?.kind === 'single' && body.singleResult.errors?.[0]) {
          body.singleResult.data = undefined
          const error = body.singleResult.errors[0]
          const code = error.extensions?.code as string | undefined
          response.http.status = setStatusCodeFromGraphQLCode(code)
          const parsedErrors = parseJSONSafe(error.message)
          if (Array.isArray(parsedErrors)) {
            body.singleResult.errors = [...parsedErrors]
          }
        }
      },
    }
  },
}
