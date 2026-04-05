import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import {
  type HashGenerator,
  type HashGeneratorGateway,
} from '@/core/application/gateways/cryptography/hash-generator.gateway'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists.error'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email.repository'
import { type SaveUserRepository } from '@/modules/users/application/repositories/save-user.repository'
import {
  SignUpUseCase,
  type SignUpUseCaseInput,
} from '@/modules/users/application/use-cases/sign-up.use-case'
import { UserEntity } from '@/modules/users/domain/entities/user.entity'
import { InvalidAgeError } from '@/modules/users/domain/errors/invalid-age.error'
import { InvalidBirthdateError } from '@/modules/users/domain/errors/invalid-birthdate.error'
import { InvalidDomainError } from '@/modules/users/domain/errors/invalid-domain.error'
import { InvalidEmailError } from '@/modules/users/domain/errors/invalid-email.error'

import {
  hashedPasswordStub,
  plaintextPasswordStub,
} from '#/modules/users/application/@mocks/password.stub'
import { makeRequiredSignUpInputStub } from '#/modules/users/application/@mocks/sign-up-input.stub'
import { makeUserEntityStub } from '#/modules/users/domain/@mocks/user-entity.stub'

describe('SignUpUseCase', () => {
  let sut: SignUpUseCase
  let userEntityStub: UserEntity
  let findUserByEmailRepositoryMock: MockProxy<FindUserByEmailRepository>
  let findUserByEmailRepositorySpy: MockInstance<
    (email: string) => Promise<UserEntity | null>
  >
  let saveUserRepositoryMock: MockProxy<SaveUserRepository>
  let saveUserRepositorySpy: MockInstance<
    (user: UserEntity) => Promise<UserEntity>
  >
  let hashGeneratorGatewayMock: MockProxy<HashGeneratorGateway>
  let hashGeneratorGatewaySpy: MockInstance<
    (input: HashGenerator.Input) => Promise<HashGenerator.Output>
  >

  beforeAll(() => {
    userEntityStub = makeUserEntityStub()
    findUserByEmailRepositoryMock = mock<FindUserByEmailRepository>()
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValue(null)
    saveUserRepositoryMock = mock<SaveUserRepository>()
    saveUserRepositoryMock.save.mockResolvedValue(userEntityStub)
    hashGeneratorGatewayMock = mock<HashGeneratorGateway>()
    hashGeneratorGatewayMock.hash.mockResolvedValue(hashedPasswordStub)
  })

  beforeEach(() => {
    findUserByEmailRepositoryMock.findByEmail.mockClear()
    saveUserRepositoryMock.save.mockClear()
    hashGeneratorGatewayMock.hash.mockClear()
  })

  beforeEach(() => {
    findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryMock,
      'findByEmail',
    )
    saveUserRepositorySpy = vi.spyOn(saveUserRepositoryMock, 'save')
    hashGeneratorGatewaySpy = vi.spyOn(hashGeneratorGatewayMock, 'hash')
    sut = new SignUpUseCase(
      {
        findByEmail: findUserByEmailRepositoryMock.findByEmail,
        save: saveUserRepositoryMock.save,
      },
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

    expect(findUserByEmailRepositorySpy).not.toHaveBeenCalled()
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(saveUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailError)
  })

  it('should be able to returns InvalidBirthdateError when birthdate is invalid', async () => {
    const user: SignUpUseCaseInput = {
      ...makeRequiredSignUpInputStub(),
      birthdate: faker.date.future(),
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).not.toHaveBeenCalled()
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(saveUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidBirthdateError)
  })

  it('should be able to returns EmailAlreadyExistsError when email already exists', async () => {
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValueOnce(
      userEntityStub,
    )
    const email = 'fake-existent-email@fake-domain.com'
    const user: SignUpUseCaseInput = {
      ...makeRequiredSignUpInputStub(),
      email,
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(saveUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should be able to returns InvalidDomainError when email domain is not valid', async () => {
    const user: SignUpUseCaseInput = {
      ...makeRequiredSignUpInputStub(),
      email: 'fake-invalid-email@invalid-domain.com',
    }

    const result = await sut.execute(user)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(saveUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDomainError)
  })

  it('should be able to returns InvalidAgeError when age is less than 18', async () => {
    const user: SignUpUseCaseInput = {
      ...makeRequiredSignUpInputStub(),
      birthdate: new Date(),
    }

    const result = await sut.execute(user)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(saveUserRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAgeError)
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
    expect(saveUserRepositorySpy).toHaveBeenCalledTimes(1)
    expect(saveUserRepositorySpy).toHaveBeenCalledWith(expect.any(UserEntity))
    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('user')
  })
})
