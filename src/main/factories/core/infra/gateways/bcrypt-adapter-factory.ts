import { BcryptAdapter } from '@/core/infra/gateways/bcrypt-adapter'
import { cryptograph } from '@/core/shared/config/env/env'

export function makeBcryptAdapterFactory() {
  const salt = cryptograph.salt
  return new BcryptAdapter(salt)
}
