import { randomUUID } from 'node:crypto'

import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'

describe('UniqueEntityIdVO', () => {
  let sut: UniqueEntityIdVO
  let UUIDstub: string

  beforeAll(() => {
    UUIDstub = randomUUID()
  })

  it('should be able to create a UniqueEntityId', () => {
    sut = new UniqueEntityIdVO()

    expect(sut.toValue()).toMatch(UUIDRegExp)
    expect(sut.toString()).toMatch(UUIDRegExp)
  })

  it('should be able to create a UniqueEntityId with value', () => {
    sut = new UniqueEntityIdVO(UUIDstub)

    expect(sut.toValue()).toBe(UUIDstub)
    expect(sut.toString()).toBe(UUIDstub)
  })

  it('should be able to compare two instances of UniqueEntityId and return false', () => {
    sut = new UniqueEntityIdVO(UUIDstub)
    const uniqueEntityIdToCompare = new UniqueEntityIdVO()

    expect(sut.equals(uniqueEntityIdToCompare)).toBe(false)
  })

  it('should be able to compare two instances of UniqueEntityId and return true', () => {
    sut = new UniqueEntityIdVO(UUIDstub)
    const uniqueEntityIdToCompare = new UniqueEntityIdVO(UUIDstub)

    expect(sut.equals(uniqueEntityIdToCompare)).toBe(true)
  })
})
