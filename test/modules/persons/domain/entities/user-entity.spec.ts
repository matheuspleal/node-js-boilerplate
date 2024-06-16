import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { UserEntity } from '@/modules/persons/domain/entities/user-entity'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'
import { EmailVO } from '@/modules/persons/domain/value-objects/email-vo'

import {
  makeFakeAllInputSignUpStub,
  makeFakeRequiredInputSignUpStub,
} from '#/modules/users/application/@mocks/input-sign-up-stub'
import { getCurrentAgeInYears } from '#/modules/users/domain/@helpers/get-current-age-in-years'

describe('UserEntity', () => {
  let sut: UserEntity

  it('should be able to create a instance of UserEntity with required props', () => {
    const fakeProps = makeFakeRequiredInputSignUpStub()

    sut = UserEntity.create(fakeProps)

    expect(sut).toMatchObject({
      _id: expect.objectContaining({
        value: expect.any(String),
      }),
      props: {
        name: fakeProps.name,
        email: new EmailVO({ value: fakeProps.email }),
        birthdate: new BirthdateVO({ value: fakeProps.birthdate }),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    })
  })

  it('should be able to create a instance of UserEntity with all props', () => {
    const { id, ...fakeProps } = makeFakeAllInputSignUpStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut).toMatchObject({
      _id: fakeUniqueEntityId,
      props: {
        name: fakeProps.name,
        email: new EmailVO({ value: fakeProps.email }),
        birthdate: new BirthdateVO({ value: fakeProps.birthdate }),
        createdAt: fakeProps.createdAt,
        updatedAt: fakeProps.updatedAt,
      },
    })
  })

  it('should be able to get all allowed properties', () => {
    const { id, ...fakeProps } = makeFakeAllInputSignUpStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.email.toString()).toEqual(fakeProps.email)
    expect(sut.birthdate.toString()).toEqual(fakeProps.birthdate.toISOString())
    expect(sut.age).toEqual(getCurrentAgeInYears(fakeProps.birthdate))
    expect(sut.createdAt).toEqual(fakeProps.createdAt)
    expect(sut.updatedAt).toEqual(fakeProps.updatedAt)
  })

  it('should be able to set all allowed properties', () => {
    const { id, ...fakeProps } = makeFakeAllInputSignUpStub()
    const fakeUniqueEntityId = new UniqueEntityIdVO(id)

    sut = UserEntity.create(fakeProps, fakeUniqueEntityId)

    expect(sut.id.toString()).toEqual(id)
    expect(sut.name).toEqual(fakeProps.name)
    expect(sut.email.toString()).toEqual(fakeProps.email)
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
