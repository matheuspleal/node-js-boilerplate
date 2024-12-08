import { AuthenticationMiddleware } from '@/core/presentation/middlewares/authentication-middleware'
import { makeJwtAdapterFactory } from '@/main/factories/core/infra/gateways/jwt-adapter-factory'

export function makeAuthenticationMiddleware() {
  return new AuthenticationMiddleware(makeJwtAdapterFactory())
}
