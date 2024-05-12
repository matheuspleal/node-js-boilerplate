import { type TokenVerifierGateway } from '@/core/application/gateways/token/token-verifier'
import { ok, unauthorized } from '@/core/presentation/helpers/http-helpers'
import { type Middleware } from '@/core/presentation/middlewares/contracts/middleware'
import { type HttpResponse } from '@/core/presentation/protocols/http'

export namespace Authentication {
  export interface Request {
    authorization: string
  }
  export type Response =
    | {
        sub: string
      }
    | Error
}

export class AuthenticationMiddleware
  implements Middleware<Authentication.Request>
{
  constructor(private readonly tokenVerifierGateway: TokenVerifierGateway) {}

  async handle({
    authorization,
  }: Authentication.Request): Promise<HttpResponse<Authentication.Response>> {
    try {
      const [, token] = authorization.split(' ')
      const { sub } = this.tokenVerifierGateway.verify({ token })
      return ok({ sub })
    } catch {
      return unauthorized()
    }
  }
}
