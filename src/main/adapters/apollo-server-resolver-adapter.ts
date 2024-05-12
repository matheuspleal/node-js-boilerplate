import { type GraphQLError } from 'graphql'

import { type HttpController } from '@/core/presentation/controllers/http-controller'
import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { isAuthorized } from '@/main/graphql/contexts/is-authorized'
import { buildGraphQLError } from '@/main/graphql/helpers/build-graphql-error'
import { formatErrorsToGraphQLErrors } from '@/main/graphql/helpers/format-errors-to-graphql-errors'

export interface ApolloServerResolverAdapterProps {
  args: any
  context: any
  requiresAuth?: boolean
}

export async function apolloServerResolverAdapter<HttpRequest, Data>(
  controller: HttpController<HttpRequest, Data>,
  props: ApolloServerResolverAdapterProps,
): Promise<Data> {
  if (props?.requiresAuth) {
    isAuthorized(props?.context)
  }
  const request: HttpRequest = {
    ...props.args,
    ...props.context,
  }
  const { statusCode, data } = await controller.handle(request)
  let graphQLErrors: undefined | readonly GraphQLError[]
  switch (statusCode) {
    case StatusCode.OK:
    case StatusCode.CREATED:
    case StatusCode.NO_CONTENT:
      return data
    case StatusCode.BAD_REQUEST:
      if ('errors' in data) {
        graphQLErrors = formatErrorsToGraphQLErrors(data.errors, statusCode)
        throw buildGraphQLError(JSON.stringify(graphQLErrors), statusCode)
      }
      throw buildGraphQLError(data.message, statusCode)
    case StatusCode.UNAUTHORIZED:
    case StatusCode.NOT_FOUND:
    case StatusCode.CONFLICT:
      throw buildGraphQLError(data.message, statusCode)
    default:
      throw buildGraphQLError('Server Error.', StatusCode.SERVER_ERROR)
  }
}
