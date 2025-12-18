import { randomUUID } from 'node:crypto'

export class UniqueEntityIdVO {
  private readonly value: string

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  equals(id: UniqueEntityIdVO) {
    return id.toValue() === this.value
  }
}
