import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import {
  type HashGenerator,
  type HashGeneratorGateway,
} from '@/core/application/gateways/cryptography/hash-generator.gateway'
import { InvalidBirthdateError } from '@/modules/persons/application/errors/invalid-birthdate.error'
import { PersonEntity } from '@/modules/persons/domain/entities/person.entity'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists.error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email.error'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email.repository'
import {
  type SaveUserRepositoryInput,
  type SaveUserRepositoryOutput,
  type SaveUserRepository,
} from '@/modules/users/application/repositories/save-user.repository'
import {
  SignUpUseCase,
  type SignUpUseCaseInput,
} from '@/modules/users/application/use-cases/sign-up.use-case'
import { UserEntity } from '@/modules/users/domain/entities/user.entity'

import { makePersonEntityStub } from '#/modules/persons/domain/@mocks/person.entity.stub'
import {
  hashedPasswordStub,
  plaintextPasswordStub,
} from '#/modules/users/application/@mocks/password.stub'
import { makeRequiredSignUpInputStub } from '#/modules/users/application/@mocks/sign-up-input.stub'
import { makeUserEntityStub } from '#/modules/users/domain/@mocks/user.entity.stub'

describe('SignUpUseCase', () => {
  let sut: SignUpUseCase
  let personEntityStub: PersonEntity
  let userEntityStub: UserEntity
  let findUserByEmailRepositoryMock: MockProxy<FindUserByEmailRepository>
  let findUserByEmailRepositorySpy: MockInstance<
    (email: string) => Promise<UserEntity | null>
  >
  let saveUserRepositoryMock: MockProxy<SaveUserRepository>
  let saveUserRepositorySpy: MockInstance<
    (input: SaveUserRepositoryInput) => Promise<SaveUserRepositoryOutput>
  >
  let hashGeneratorGatewayMock: MockProxy<HashGeneratorGateway>
  let hashGeneratorGatewaySpy: MockInstance<
    (input: HashGenerator.Input) => Promise<HashGenerator.Output>
  >

  beforeAll(() => {
    personEntityStub = makePersonEntityStub()
    userEntityStub = makeUserEntityStub({
      userInput: { personId: personEntityStub?.id },
    })
    findUserByEmailRepositoryMock = mock<FindUserByEmailRepository>()
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValue(null)
    saveUserRepositoryMock = mock<SaveUserRepository>()
    saveUserRepositoryMock.save.mockResolvedValue({
      person: personEntityStub,
      user: userEntityStub,
    })
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

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
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

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(hashGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(saveUserRepositorySpy).not.toHaveBeenCalled()
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
    expect(saveUserRepositorySpy).not.toHaveBeenCalled()
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
    expect(saveUserRepositorySpy).toHaveBeenCalledTimes(1)
    expect(saveUserRepositorySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        person: expect.any(PersonEntity),
        user: expect.any(UserEntity),
      }),
    )
    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('user')
  })
})
