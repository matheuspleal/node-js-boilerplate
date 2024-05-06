import { randomUUID } from 'node:crypto'

import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'

describe('UniqueEntityId', () => {
  let sut: UniqueEntityId
  let UUIDstub: string

  beforeAll(() => {
    UUIDstub = randomUUID()
  })

  it('should be able to create a UniqueEntityId', () => {
    sut = new UniqueEntityId()

    expect(sut.toValue()).toMatch(UUIDRegExp)
    expect(sut.toString()).toMatch(UUIDRegExp)
  })

  it('should be able to create a UniqueEntityId with value', () => {
    sut = new UniqueEntityId(UUIDstub)

    expect(sut.toValue()).toBe(UUIDstub)
    expect(sut.toString()).toBe(UUIDstub)
  })

  it('should be able to compare two instances of UniqueEntityId and return false', () => {
    sut = new UniqueEntityId(UUIDstub)
    const uniqueEntityIdToCompare = new UniqueEntityId()

    expect(sut.equals(uniqueEntityIdToCompare)).toBe(false)
  })

  it('should be able to compare two instances of UniqueEntityId and return true', () => {
    sut = new UniqueEntityId(UUIDstub)
    const uniqueEntityIdToCompare = new UniqueEntityId(UUIDstub)

    expect(sut.equals(uniqueEntityIdToCompare)).toBe(true)
  })
})
