import { faker } from '@faker-js/faker'
import { MockInstance } from 'vitest'
import { MockProxy, mock } from 'vitest-mock-extended'

import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/users/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { CreateUserRepository } from '@/modules/users/application/repositories/create-user-repository'
import { FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'
import {
  CreateUser,
  CreateUserUseCase,
} from '@/modules/users/application/use-cases/create-user-use-case'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'
import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'
import { Email } from '@/modules/users/domain/value-objects/email'

import { makeFakeRequiredInputUserStub } from '#/modules/users/domain/@mocks/input-user-stub'
import { makeFakeUserEntityStub } from '#/modules/users/domain/@mocks/user-entity-stub'

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase
  let userEntityStub: UserEntity
  let findUserByEmailRepositoryMock: MockProxy<FindUserByEmailRepository>
  let findUserByEmailRepositorySpy: MockInstance<
    [string],
    Promise<UserEntity | null>
  >

  let createUserRepositoryMock: MockProxy<CreateUserRepository>
  let createUserRepositorySpy: MockInstance<
    [user: UserEntity],
    Promise<UserEntity>
  >

  beforeAll(() => {
    userEntityStub = makeFakeUserEntityStub()
    findUserByEmailRepositoryMock = mock<FindUserByEmailRepository>()
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValue(null)
    createUserRepositoryMock = mock<CreateUserRepository>()
    createUserRepositoryMock.create.mockResolvedValue(userEntityStub)
  })

  beforeEach(() => {
    findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryMock,
      'findByEmail',
    )
    createUserRepositorySpy = vi.spyOn(createUserRepositoryMock, 'create')
    sut = new CreateUserUseCase(
      findUserByEmailRepositoryMock,
      createUserRepositoryMock,
    )
  })

  it('should be able to returns EmailAlreadyExistsError when email already exists', async () => {
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValueOnce(
      userEntityStub,
    )
    const email = 'fake-existent-email'
    const user: CreateUser.Input = {
      ...makeFakeRequiredInputUserStub(),
      email,
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
    expect(createUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should be able to returns InvalidEmailError when email is invalid', async () => {
    const email = 'fake-invalid-email'
    const user: CreateUser.Input = {
      ...makeFakeRequiredInputUserStub(),
      email,
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
    expect(createUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailError)
  })

  it('should be able to returns InvalidBirthdateError when birthdate is invalid', async () => {
    const user: CreateUser.Input = {
      ...makeFakeRequiredInputUserStub(),
      birthdate: faker.date.future(),
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(createUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidBirthdateError)
  })

  it('should be able to returns UserDTO when user is created', async () => {
    const user: CreateUser.Input = makeFakeRequiredInputUserStub()

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(createUserRepositorySpy).toHaveBeenCalledTimes(1)
    expect(createUserRepositorySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.objectContaining({
          value: expect.any(String),
        }),
        props: expect.objectContaining({
          name: user.name,
          email: new Email(user.email),
          birthdate: new Birthdate(user.birthdate),
        }),
      }),
    )
    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('user')
  })
})
