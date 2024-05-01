import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import {
  type HashGenerator,
  type HashGeneratorGateway,
} from '@/core/application/gateways/cryptography/hash-generator'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/users/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { type CreateUserRepository } from '@/modules/users/application/repositories/create-user-repository'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'
import {
  type SignUp,
  SignUpUseCase,
} from '@/modules/users/application/use-cases/sign-up-use-case'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'
import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'
import { Email } from '@/modules/users/domain/value-objects/email'

import { makeFakeRequiredInputSignUpStub } from '#/modules/users/domain/@mocks/input-sign-up-stub'
import {
  hashedPasswordStub,
  plaintextPasswordStub,
} from '#/modules/users/domain/@mocks/password-stub'
import { makeFakeUserEntityStub } from '#/modules/users/domain/@mocks/user-entity-stub'

describe('SignUpUseCase', () => {
  let sut: SignUpUseCase
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

  let hashGeneratorGatewayMock: MockProxy<HashGeneratorGateway>
  let hashGeneratorGatewaySpy: MockInstance<
    [input: HashGenerator.Input],
    Promise<HashGenerator.Output>
  >

  beforeAll(() => {
    userEntityStub = makeFakeUserEntityStub()
    findUserByEmailRepositoryMock = mock<FindUserByEmailRepository>()
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValue(null)
    createUserRepositoryMock = mock<CreateUserRepository>()
    createUserRepositoryMock.create.mockResolvedValue(userEntityStub)
    hashGeneratorGatewayMock = mock<HashGeneratorGateway>()
    hashGeneratorGatewayMock.hash.mockResolvedValue(hashedPasswordStub)
  })

  beforeEach(() => {
    findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryMock,
      'findByEmail',
    )
    createUserRepositorySpy = vi.spyOn(createUserRepositoryMock, 'create')
    hashGeneratorGatewaySpy = vi.spyOn(hashGeneratorGatewayMock, 'hash')
    sut = new SignUpUseCase(
      findUserByEmailRepositoryMock,
      createUserRepositoryMock,
      hashGeneratorGatewayMock,
    )
  })

  it('should be able to returns EmailAlreadyExistsError when email already exists', async () => {
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValueOnce(
      userEntityStub,
    )
    const email = 'fake-existent-email'
    const user: SignUp.Input = {
      ...makeFakeRequiredInputSignUpStub(),
      email,
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(createUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should be able to returns InvalidEmailError when email is invalid', async () => {
    const email = 'fake-invalid-email'
    const user: SignUp.Input = {
      ...makeFakeRequiredInputSignUpStub(),
      email,
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(createUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailError)
  })

  it('should be able to returns InvalidBirthdateError when birthdate is invalid', async () => {
    const user: SignUp.Input = {
      ...makeFakeRequiredInputSignUpStub(),
      birthdate: faker.date.future(),
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(createUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidBirthdateError)
  })

  it('should be able to returns UserDTO when user is created', async () => {
    const user: SignUp.Input = makeFakeRequiredInputSignUpStub()

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
    expect(hashGeneratorGatewaySpy).toHaveBeenCalledTimes(1)
    expect(hashGeneratorGatewaySpy).toHaveBeenCalledWith({
      plaintext: plaintextPasswordStub,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('user')
  })
})
