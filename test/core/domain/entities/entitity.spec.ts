import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'

import { Entity } from '@/core/domain/entities/entity'
import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { type Optional } from '@/core/shared/types/optional'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import {
  type FakeProps,
  makeFakeAllPropsStub,
  makeFakeRequiredPropsStub,
} from '#/core/domain/@mocks/fake-props-stub'

class FakeEntity extends Entity<FakeProps> {
  get name(): string | undefined {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email(): string {
    return this.props.email
  }

  get birthdate(): Date {
    return this.props.birthdate
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<FakeProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityIdVO,
  ) {
    const fakeEntity = new FakeEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
    return fakeEntity
  }
}

describe('Entity', () => {
  let sut: FakeEntity
  let fakeRequiredPropsStub: Optional<FakeProps, 'createdAt' | 'updatedAt'>
  let fakeAllPropsStub: FakeProps
  let fakeFullName: string
  let uniqueEntityIdStub: UniqueEntityIdVO

  beforeAll(() => {
    uniqueEntityIdStub = new UniqueEntityIdVO(randomUUID())
    fakeRequiredPropsStub = makeFakeRequiredPropsStub()
    fakeAllPropsStub = makeFakeAllPropsStub()
    fakeFullName = faker.person.fullName()
  })

  it('should be able to create an Entity with required props', () => {
    sut = FakeEntity.create(fakeRequiredPropsStub)

    expect(sut.id.toString()).toMatch(UUIDRegExp)
    expect(sut.name).toBeUndefined()
    expect(sut.birthdate).toBe(fakeRequiredPropsStub.birthdate)
    expect(sut.email).toBe(fakeRequiredPropsStub.email)
    expect(sut.createdAt).toEqual(expect.any(Date))
    expect(sut.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to create an Entity with required props and UniqueEntityId', () => {
    sut = FakeEntity.create(fakeRequiredPropsStub, uniqueEntityIdStub)

    expect(sut.id.toString()).toMatch(UUIDRegExp)
    expect(sut.id).toBe(uniqueEntityIdStub)
    expect(sut.name).toBeUndefined()
    expect(sut.birthdate).toBe(fakeRequiredPropsStub.birthdate)
    expect(sut.email).toBe(fakeRequiredPropsStub.email)
    expect(sut.createdAt).toEqual(expect.any(Date))
    expect(sut.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to create an Entity with required props and set the name later', () => {
    sut = FakeEntity.create(fakeRequiredPropsStub)

    expect(sut.id.toString()).toMatch(UUIDRegExp)
    expect(sut.name).toBeUndefined()

    sut.name = fakeFullName

    expect(sut.name).toBe(fakeFullName)
    expect(sut.birthdate).toBe(fakeRequiredPropsStub.birthdate)
    expect(sut.email).toBe(fakeRequiredPropsStub.email)
    expect(sut.createdAt).toEqual(expect.any(Date))
    expect(sut.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to create an Entity with required props, UniqueEntityId and set the name later', () => {
    sut = FakeEntity.create(fakeRequiredPropsStub, uniqueEntityIdStub)

    expect(sut.id.toString()).toMatch(UUIDRegExp)
    expect(sut.id).toBe(uniqueEntityIdStub)
    expect(sut.name).toBeUndefined()

    sut.name = fakeFullName

    expect(sut.name).toBe(fakeFullName)
    expect(sut.birthdate).toBe(fakeRequiredPropsStub.birthdate)
    expect(sut.email).toBe(fakeRequiredPropsStub.email)
    expect(sut.createdAt).toEqual(expect.any(Date))
    expect(sut.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to create an Entity with all props', () => {
    sut = FakeEntity.create(fakeAllPropsStub)

    expect(sut.id.toString()).toMatch(UUIDRegExp)
    expect(sut.name).toBe(fakeAllPropsStub.name)
    expect(sut.birthdate).toBe(fakeAllPropsStub.birthdate)
    expect(sut.email).toBe(fakeAllPropsStub.email)
    expect(sut.createdAt).toBe(fakeAllPropsStub.createdAt)
    expect(sut.updatedAt).toBe(fakeAllPropsStub.updatedAt)
  })

  it('should be able to create an Entity with all props and UniqueEntityId', () => {
    sut = FakeEntity.create(fakeAllPropsStub, uniqueEntityIdStub)

    expect(sut.id.toString()).toMatch(UUIDRegExp)
    expect(sut.id).toBe(uniqueEntityIdStub)
    expect(sut.name).toBe(fakeAllPropsStub.name)
    expect(sut.birthdate).toBe(fakeAllPropsStub.birthdate)
    expect(sut.email).toBe(fakeAllPropsStub.email)
    expect(sut.createdAt).toBe(fakeAllPropsStub.createdAt)
    expect(sut.updatedAt).toBe(fakeAllPropsStub.updatedAt)
  })

  it('should be able to create an Entity with all props, UniqueEntityId and set the name later', () => {
    sut = FakeEntity.create(fakeAllPropsStub, uniqueEntityIdStub)

    expect(sut.id.toString()).toMatch(UUIDRegExp)
    expect(sut.id).toBe(uniqueEntityIdStub)
    expect(sut.name).toBe(fakeAllPropsStub.name)

    sut.name = fakeFullName

    expect(sut.name).toBe(fakeFullName)
    expect(sut.birthdate).toBe(fakeAllPropsStub.birthdate)
    expect(sut.email).toBe(fakeAllPropsStub.email)
    expect(sut.createdAt).toBe(fakeAllPropsStub.createdAt)
    expect(sut.updatedAt).not.toBe(fakeAllPropsStub.updatedAt)
    expect(sut.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to compare two instances of Entity and return false when id is not equal', () => {
    sut = FakeEntity.create(fakeRequiredPropsStub)
    const fakeEntityToCompare = FakeEntity.create(fakeRequiredPropsStub)

    expect(sut.equals(fakeEntityToCompare)).toBe(false)
  })

  it('should be able to compare two instances of Entity and return true when id is equal', () => {
    sut = FakeEntity.create(fakeRequiredPropsStub, uniqueEntityIdStub)
    const fakeEntityToCompare = FakeEntity.create(
      fakeAllPropsStub,
      uniqueEntityIdStub,
    )

    expect(sut.equals(fakeEntityToCompare)).toBe(true)
  })

  it('should be able to compare two instances of Entity and return true when the instances are equal', () => {
    sut = FakeEntity.create(fakeRequiredPropsStub, uniqueEntityIdStub)
    const fakeEntityToCompare = sut

    expect(sut.equals(fakeEntityToCompare)).toBe(true)
  })
})
