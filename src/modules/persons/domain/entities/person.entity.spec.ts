import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import {
  PersonEntity,
  PersonProps,
} from '@/modules/persons/domain/entities/person.entity'
import { InvalidAgeError } from '@/modules/persons/domain/errors/invalid-age.error'
import { PersonCreatedEvent } from '@/modules/persons/domain/events/person-created.event'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate.vo'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { getCurrentAgeInYears } from '#/modules/persons/domain/@helpers/get-current-age-in-years'
import { makePersonInputStub } from '#/modules/persons/domain/@mocks/person-entity.stub'

describe('PersonEntity', () => {
  let sut: PersonEntity

  it('should not be able to create an instance when age is less than 18', () => {
    const fakeProps = makePersonInputStub({
      birthdate: BirthdateVO.create({ value: new Date() }).value as BirthdateVO,
    })

    const result = PersonEntity.create(fakeProps)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAgeError)
  })

  it('should be able to create an instance with required props', () => {
    const fakeProps = makePersonInputStub()

    sut = PersonEntity.create(fakeProps).value as PersonEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toString()).toEqual(
      fakeProps.birthdate.toValue().toISOString(),
    )
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate.toValue()))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to create an instance with all props', () => {
    const { id, ...fakeProps } = makePersonInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = PersonEntity.create(fakeProps, fakeUniqueEntityId)
      .value as PersonEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id).toEqual(fakeUniqueEntityId)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toString()).toEqual(
      fakeProps.birthdate.toValue().toISOString(),
    )
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate.toValue()))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to get all allowed properties of an instance', () => {
    const { id, ...fakeProps } = makePersonInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = PersonEntity.create(fakeProps, fakeUniqueEntityId)
      .value as PersonEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id).toEqual(fakeUniqueEntityId)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toString()).toEqual(
      fakeProps.birthdate.toValue().toISOString(),
    )
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate.toValue()))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to set all allowed properties of an instance', () => {
    const { id, ...fakeProps } = makePersonInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = PersonEntity.create(fakeProps, fakeUniqueEntityId)
      .value as PersonEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id).toEqual(fakeUniqueEntityId)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toString()).toEqual(
      fakeProps.birthdate.toValue().toISOString(),
    )
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate.toValue()))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)

    const reassignedName = 'fake-reassigned-name'
    sut.name = reassignedName

    expect(sut.name).toEqual(reassignedName)
    expect(sut.updatedAt).not.toEqual(fakeProps.updatedAt)
  })

  it('should be able to emit PersonCreatedEvent when created', () => {
    const fakeProps = makePersonInputStub()

    sut = PersonEntity.create(fakeProps).value as PersonEntity

    expect(sut.domainEvents).toHaveLength(1)
    expect(sut.domainEvents[0]).toBeInstanceOf(PersonCreatedEvent)
    expect(sut.domainEvents[0].aggregateId).toEqual(sut.id)
  })

  it('should not emit domain events when reconstituted', () => {
    const { id, ...fakeProps } = makePersonInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)
    const created = PersonEntity.create(fakeProps, fakeUniqueEntityId)
      .value as PersonEntity
    const props: PersonProps = {
      name: created.name,
      birthdate: created.birthdate,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    }

    const reconstituted = PersonEntity.reconstitute(props, created.id)

    expect(reconstituted.domainEvents).toHaveLength(0)
  })

  it('should be able to reconstitute an instance of valid props', () => {
    const { id, ...fakeProps } = makePersonInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = PersonEntity.create(fakeProps, fakeUniqueEntityId)
      .value as PersonEntity
    const props: PersonProps = {
      name: sut.name,
      birthdate: sut.birthdate,
      createdAt: sut.createdAt,
      updatedAt: sut.updatedAt,
    }
    const reconstitutedPerson = PersonEntity.reconstitute(props, sut.id)

    expect(reconstitutedPerson).toBeInstanceOf(PersonEntity)
  })
})
