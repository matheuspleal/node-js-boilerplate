import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'
import { EmailVO } from '@/modules/users/domain/value-objects/email-vo'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { makeUserInputStub } from '#/modules/users/domain/@mocks/user-entity-stub'

describe('UserEntity', () => {
  let sut: UserEntity

  it('should be able to create a instance of UserEntity with required props', () => {
    const fakeProps = makeUserInputStub()

    sut = UserEntity.create(fakeProps)

    expect(sut.id).toBeInstanceOf(UniqueEntityIdVO)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email)
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to create a instance of UserEntity with all props', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut.id).toBeInstanceOf(UniqueEntityIdVO)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email)
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to get all allowed properties', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut.id).toBeInstanceOf(UniqueEntityIdVO)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email)
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to set all allowed properties', () => {
    const { id, ...fakeProps } = makeUserInputStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut.id).toBeInstanceOf(UniqueEntityIdVO)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.id.toString()).toEqual(id)
    expect(sut.email).toBeInstanceOf(EmailVO)
    expect(sut.email.toString()).toEqual(fakeProps.email)
    expect(sut.password).toEqual(fakeProps.password)
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)

    const reassignedPassword = 'fake-reassigned-password'
    sut.password = reassignedPassword

    expect(sut.password).toEqual(reassignedPassword)
    expect(sut.updatedAt).not.toEqual(fakeProps.updatedAt)
  })
})
