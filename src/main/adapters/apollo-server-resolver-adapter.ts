import { GraphQLError } from 'graphql'

import { type HttpController } from '@/core/presentation/controllers/http-controller'

function isClientError(statusCode: number) {
  return statusCode > 399 && statusCode < 500
}

function isServerError(statusCode: number) {
  return statusCode > 499
}

function buildGraphQLError(body: any, code: string, statusCode: number) {
  return new GraphQLError(body, {
    extensions: {
      code,
      http: {
        status: statusCode,
      },
    },
  })
}

export async function apolloServerResolverAdapter<HttpRequest, Data>(
  controller: HttpController<HttpRequest, Data>,
  args?: any,
): Promise<Data> {
  const { statusCode, body } = await controller.handle(args)
  if (isClientError(statusCode)) {
    throw buildGraphQLError(body, 'CLIENT_ERROR', statusCode)
  }
  if (isServerError(statusCode)) {
    throw buildGraphQLError(body, 'SERVER_ERROR', statusCode)
  }
  return body
}
