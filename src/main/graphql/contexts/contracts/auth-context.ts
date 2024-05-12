import { type ApolloFastifyContextFunction } from '@as-integrations/fastify'

import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { makeAuthenticationMiddleware } from '@/main/factories/core/presentation/middlewares/authentication-middleware-factory'

export interface AuthContext {
  sub?: string
}

export const authContext: ApolloFastifyContextFunction<AuthContext> = async (
  request,
  reply,
) => {
  const { statusCode, data } = await makeAuthenticationMiddleware().handle({
    authorization: request.headers.authorization ?? '',
  })
  if (statusCode !== StatusCode.OK || data instanceof Error) {
    return { sub: undefined }
  }
  return { sub: data.sub }
}
