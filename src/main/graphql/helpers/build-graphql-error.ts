import { GraphQLError } from 'graphql'

import { setGraphQLCodeFromStatusCode } from '@/main/graphql/helpers/set-graphql-code-from-status-code'

export function buildGraphQLError(data: any, statusCode: number): GraphQLError {
  return new GraphQLError(data, {
    extensions: {
      code: setGraphQLCodeFromStatusCode(statusCode),
    },
  })
}
