import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import {
  UserEntity,
  UserProps,
} from '@/modules/users/domain/entities/user.entity'
import { InvalidAgeError } from '@/modules/users/domain/errors/invalid-age.error'
import { InvalidDomainError } from '@/modules/users/domain/errors/invalid-domain.error'
import { UserCreatedEvent } from '@/modules/users/domain/events/user-created.event'
import { UserPasswordChangedEvent } from '@/modules/users/domain/events/user-password-changed.event'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate.vo'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'
import { PasswordVO } from '@/modules/users/domain/value-objects/password.vo'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { makeUserInputStub } from '#/modules/users/domain/@mocks/user-entity.stub'

describe('UserEntity', () => {
  let sut: UserEntity

  it('should not be able to create an instance when email domain is not valid', () => {
    const fakeProps = makeUserInputStub({
      email: EmailVO.create({ value: 'john.doe@example.com' }).value as EmailVO,
    })

    const result = UserEntity.create(fakeProps)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDomainError)
  })

  it('should not be able to create an instance when age is less than minimum', () => {
    const fakeProps = makeUserInputStub({
      birthdate: BirthdateVO.reconstitute(new Date()),
    })

    const result = UserEntity.create(fakeProps)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAgeError)
  })

  it('should be able to create an instance with required props', () => {
    const fakeProps = makeUserInputStub()

    sut = UserEntity.create(fakeProps).value as UserEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.birthdate.toValue()).toEqual(fakeProps.birthdate.toValue())
    expect(sut.age).toBeGreaterThanOrEqual(18)
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email.toValue())
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to create an instance with all props', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId).value as UserEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.birthdate).toBeInstanceOf(BirthdateVO)
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email.toValue())
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to change name via domain method', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId).value as UserEntity
    const previousUpdatedAt = sut.updatedAt

    sut.changeName('New Name')

    expect(sut.name).toEqual('New Name')
    expect(sut.updatedAt).not.toEqual(previousUpdatedAt)
  })

  it('should be able to change password via domain method and emit event', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId).value as UserEntity
    const previousUpdatedAt = sut.updatedAt
    const eventsBeforeChange = sut.domainEvents.length

    const newPassword = PasswordVO.reconstitute('new-hashed-password')
    sut.changePassword(newPassword)

    expect(sut.password.toValue()).toEqual('new-hashed-password')
    expect(sut.updatedAt).not.toEqual(previousUpdatedAt)
    expect(sut.domainEvents).toHaveLength(eventsBeforeChange + 1)
    expect(sut.domainEvents[eventsBeforeChange]).toBeInstanceOf(
      UserPasswordChangedEvent,
    )
    expect(sut.domainEvents[eventsBeforeChange].aggregateId).toEqual(sut.id)
  })

  it('should be able to emit UserCreatedEvent when created', () => {
    const fakeProps = makeUserInputStub()

    sut = UserEntity.create(fakeProps).value as UserEntity

    expect(sut.domainEvents).toHaveLength(1)
    expect(sut.domainEvents[0]).toBeInstanceOf(UserCreatedEvent)
    expect(sut.domainEvents[0].aggregateId).toEqual(sut.id)
  })

  it('should not emit domain events when reconstituted', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)
    const created = UserEntity.create(fakeProps, fakeUniqueEntityId)
      .value as UserEntity
    const props: UserProps = {
      name: created.name,
      birthdate: created.birthdate,
      email: created.email,
      password: created.password,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    }

    const reconstituted = UserEntity.reconstitute(props, created.id)

    expect(reconstituted.domainEvents).toHaveLength(0)
  })

  it('should be able to reconstitute an instance of valid props', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId).value as UserEntity
    const props: UserProps = {
      name: sut.name,
      birthdate: sut.birthdate,
      email: sut.email,
      password: sut.password,
      createdAt: sut.createdAt,
      updatedAt: sut.updatedAt,
    }
    const reconstitutedUser = UserEntity.reconstitute(props, sut.id)

    expect(reconstitutedUser).toBeInstanceOf(UserEntity)
  })
})
