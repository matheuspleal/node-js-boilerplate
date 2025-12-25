import { randomUUID } from 'node:crypto'

import { Identifier } from '@/core/domain/identifier'

export class UniqueEntityId extends Identifier<string> {
  constructor(id?: string) {
    super(id ?? randomUUID())
  }
}
