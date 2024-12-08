import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { PersonEntity } from '@/modules/persons/domain/entities/person-entity'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { getCurrentAgeInYears } from '#/modules/persons/domain/@helpers/get-current-age-in-years'
import { makePersonInputStub } from '#/modules/persons/domain/@mocks/person-entity-stub'

describe('PersonEntity', () => {
  let sut: PersonEntity

  it('should be able to create a instance of PersonEntity with required props', () => {
    const fakeProps = makePersonInputStub()

    sut = PersonEntity.create(fakeProps)

    expect(sut.id).toBeInstanceOf(UniqueEntityIdVO)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toString()).toEqual(fakeProps.birthdate.toISOString())
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to create a instance of PersonEntity with all props', () => {
    const { id, ...fakeProps } = makePersonInputStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = PersonEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut.id).toBeInstanceOf(UniqueEntityIdVO)
    expect(sut.id).toEqual(fakeUniqueEntityId)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toString()).toEqual(fakeProps.birthdate.toISOString())
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to get all allowed properties', () => {
    const { id, ...fakeProps } = makePersonInputStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = PersonEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut.id).toBeInstanceOf(UniqueEntityIdVO)
    expect(sut.id).toEqual(fakeUniqueEntityId)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toString()).toEqual(fakeProps.birthdate.toISOString())
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to set all allowed properties', () => {
    const { id, ...fakeProps } = makePersonInputStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = PersonEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut.id).toBeInstanceOf(UniqueEntityIdVO)
    expect(sut.id).toEqual(fakeUniqueEntityId)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toString()).toEqual(fakeProps.birthdate.toISOString())
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)

    const reassignedName = 'fake-reassigned-name'
    sut.name = reassignedName

    expect(sut.name).toEqual(reassignedName)
    expect(sut.updatedAt).not.toEqual(fakeProps.updatedAt)
  })
})
