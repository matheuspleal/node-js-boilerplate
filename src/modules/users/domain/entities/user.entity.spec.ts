import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import {
  UserEntity,
  UserProps,
} from '@/modules/users/domain/entities/user.entity'
import { InvalidDomainError } from '@/modules/users/domain/errors/invalid-domain.error'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'

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

  it('should be able to create an instance with required props', () => {
    const fakeProps = makeUserInputStub()

    sut = UserEntity.create(fakeProps).value as UserEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
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
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email.toValue())
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to get all allowed properties of an instance', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId).value as UserEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email.toValue())
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to set all allowed properties of an instance', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId).value as UserEntity

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email.toValue())
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)

    const reassignedPassword = 'fake-reassigned-password'
    sut.password = reassignedPassword

    expect(sut.password).toEqual(reassignedPassword)
    expect(sut.updatedAt).not.toEqual(fakeProps.updatedAt)
  })

  it('should be able to reconstitute an instance', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityId(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId).value as UserEntity
    const props: UserProps = {
      personId: sut.personId,
      email: sut.email,
      password: sut.password,
      createdAt: sut.createdAt,
      updatedAt: sut.updatedAt,
    }
    const reconstitutedUser = UserEntity.reconstitute(props, sut.id)

    expect(reconstitutedUser).toBeInstanceOf(UserEntity)
  })
})
