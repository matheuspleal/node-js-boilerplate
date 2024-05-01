import { compare, hash } from 'bcryptjs'

import {
  type HashCompare,
  type HashCompareGateway,
} from '@/core/application/gateways/cryptography/hash-compare'
import {
  type HashGenerator,
  type HashGeneratorGateway,
} from '@/core/application/gateways/cryptography/hash-generator'

export class BcryptAdapter implements HashGeneratorGateway, HashCompareGateway {
  constructor(private readonly salt: number) {}

  async hash({
    plaintext,
  }: HashGenerator.Input): Promise<HashGenerator.Output> {
    return hash(plaintext, this.salt)
  }

  async compare({
    plaintext,
    digest,
  }: HashCompare.Input): Promise<HashCompare.Output> {
    return compare(plaintext, digest)
  }
}
