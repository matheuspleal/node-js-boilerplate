import { randomUUID } from 'node:crypto'

import { makeJwtAdapterFactory } from '@/main/factories/core/infra/gateways/jwt-adapter-factory'

export interface GenerateAccessTokenStubProps {
  id?: string
}

export async function generateAccessToken(
  props?: GenerateAccessTokenStubProps,
): Promise<string> {
  return makeJwtAdapterFactory().generate({
    payload: {
      sub: props?.id ?? randomUUID(),
    },
    expiresInMs: 60 * 1000 * 5,
  })
}
