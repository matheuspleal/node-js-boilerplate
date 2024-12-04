import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import {
  type HashGenerator,
  type HashGeneratorGateway,
} from '@/core/application/gateways/cryptography/hash-generator'
import { InvalidBirthdateError } from '@/modules/persons/application/errors/invalid-birthdate-error'
import { PersonEntity } from '@/modules/persons/domain/entities/person-entity'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import {
  type CreateUserRepositoryInput,
  type CreateUserRepositoryOutput,
  type CreateUserRepository,
} from '@/modules/users/application/repositories/create-user-repository'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'
import {
  SignUpUseCase,
  type SignUpUseCaseInput,
} from '@/modules/users/application/use-cases/sign-up-use-case'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'

import { makePersonEntityStub } from '#/modules/persons/domain/@mocks/person-entity-stub'
import {
  hashedPasswordStub,
  plaintextPasswordStub,
} from '#/modules/users/application/@mocks/password-stub'
import { makeRequiredSignUpInputStub } from '#/modules/users/application/@mocks/sign-up-input-stub'
import { makeUserEntityStub } from '#/modules/users/domain/@mocks/user-entity-stub'

describe('SignUpUseCase', () => {
  let sut: SignUpUseCase
  let personEntityStub: PersonEntity
  let userEntityStub: UserEntity
  let findUserByEmailRepositoryMock: MockProxy<FindUserByEmailRepository>
  let findUserByEmailRepositorySpy: MockInstance<
    [string],
    Promise<UserEntity | null>
  >
  let createUserRepositoryMock: MockProxy<CreateUserRepository>
  let createUserRepositorySpy: MockInstance<
    [CreateUserRepositoryInput],
    Promise<CreateUserRepositoryOutput>
  >
  let hashGeneratorGatewayMock: MockProxy<HashGeneratorGateway>
  let hashGeneratorGatewaySpy: MockInstance<
    [HashGenerator.Input],
    Promise<HashGenerator.Output>
  >

  beforeAll(() => {
    personEntityStub = makePersonEntityStub()
    userEntityStub = makeUserEntityStub({
      userInput: { personId: personEntityStub?.id },
    })
    findUserByEmailRepositoryMock = mock<FindUserByEmailRepository>()
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValue(null)
    createUserRepositoryMock = mock<CreateUserRepository>()
    createUserRepositoryMock.create.mockResolvedValue({
      person: personEntityStub,
      user: userEntityStub,
    })
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

  it('should be able to returns InvalidEmailError when email is invalid', async () => {
    const email = 'fake-invalid-email'
    const user: SignUpUseCaseInput = {
      ...makeRequiredSignUpInputStub(),
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
    const user: SignUpUseCaseInput = {
      ...makeRequiredSignUpInputStub(),
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

  it('should be able to returns EmailAlreadyExistsError when email already exists', async () => {
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValueOnce(
      userEntityStub,
    )
    const email = 'fake-existent-email'
    const user: SignUpUseCaseInput = {
      ...makeRequiredSignUpInputStub(),
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

  it('should be able to returns UserDTO when user is created', async () => {
    const user: SignUpUseCaseInput = makeRequiredSignUpInputStub()

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(hashGeneratorGatewaySpy).toHaveBeenCalledTimes(1)
    expect(hashGeneratorGatewaySpy).toHaveBeenCalledWith({
      plaintext: plaintextPasswordStub,
    })
    expect(createUserRepositorySpy).toHaveBeenCalledTimes(1)
    expect(createUserRepositorySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        person: expect.any(PersonEntity),
        user: expect.any(UserEntity),
      }),
    )
    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('user')
  })
})
