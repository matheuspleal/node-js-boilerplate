import { JwtAdapter } from '@/core/infra/gateways/jwt-adapter.gateway'
import { token } from '@/core/shared/config/env'

export function makeJwtAdapterFactory() {
  return new JwtAdapter(token.privateKey, token.publicKey)
}
