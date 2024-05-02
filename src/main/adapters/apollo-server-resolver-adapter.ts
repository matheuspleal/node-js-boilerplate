import { GraphQLError } from 'graphql'

import { type HttpController } from '@/core/presentation/controllers/http-controller'

function isClientError(statusCode: number) {
  return statusCode > 399 && statusCode < 500
}

function isServerError(statusCode: number) {
  return statusCode > 499
}

function buildGraphQLError(data: any, code: string, statusCode: number) {
  return new GraphQLError(data, {
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
  const { statusCode, data } = await controller.handle(args)
  if (isClientError(statusCode)) {
    throw buildGraphQLError(data, 'CLIENT_ERROR', statusCode)
  }
  if (isServerError(statusCode)) {
    throw buildGraphQLError(data, 'SERVER_ERROR', statusCode)
  }
  return data
}
