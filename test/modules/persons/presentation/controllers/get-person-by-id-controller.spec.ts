import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { left, right } from '@/core/application/either'
import { InvalidUUIDError } from '@/core/presentation/validators/errors/invalid-uuid-error'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite-error'
import { PersonNotFoundError } from '@/modules/persons/application/errors/person-not-found-error'
import { type PersonDTO } from '@/modules/persons/application/use-cases/dtos/person-dto'
import { type GetPersonByIdUseCase } from '@/modules/persons/application/use-cases/get-person-by-id-use-case'
import { GetPersonByIdController } from '@/modules/persons/presentation/controllers/get-person-by-id-controller'

import { makePersonDTOStub } from '#/modules/persons/application/@mocks/person-dto-stub'

describe('GetPersonById', () => {
  let sut: GetPersonByIdController
  let personDTOStub: PersonDTO
  let getPersonByIdUseCaseMock: MockProxy<GetPersonByIdUseCase>
  let getPersonByIdUseCaseSpy: MockInstance

  beforeAll(() => {
    personDTOStub = makePersonDTOStub()
    getPersonByIdUseCaseMock = mock<GetPersonByIdUseCase>()
    getPersonByIdUseCaseMock.execute.mockResolvedValue(
      right({
        person: personDTOStub,
      }),
    )
  })

  beforeEach(() => {
    getPersonByIdUseCaseSpy = vi.spyOn(getPersonByIdUseCaseMock, 'execute')
    sut = new GetPersonByIdController(getPersonByIdUseCaseMock)
  })

  it('should be able to return InvalidUUIDError when id is not in uuid format', async () => {
    const invalidId = 'invalid-uuid'

    const response = await sut.handle({
      id: invalidId,
    })

    expect(getPersonByIdUseCaseSpy).not.toHaveBeenCalled()
    expect(response).toEqual({
      statusCode: 400,
      data: new ValidationCompositeError([
        new InvalidUUIDError('id', invalidId),
      ]),
    })
  })

  it('should be able to return PersonNotFoundError when person is not found', async () => {
    const id = faker.string.uuid()
    const fakePersonNotFoundError = new PersonNotFoundError(id)
    getPersonByIdUseCaseMock.execute.mockResolvedValueOnce(
      left(fakePersonNotFoundError),
    )

    const response = await sut.handle({
      id,
    })

    expect(getPersonByIdUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(getPersonByIdUseCaseSpy).toHaveBeenCalledWith({
      id,
    })
    expect(response).toEqual({
      statusCode: 404,
      data: fakePersonNotFoundError,
    })
  })

  it('should be able to return person when person is found', async () => {
    const id = personDTOStub.id

    const response = await sut.handle({
      id,
    })

    expect(getPersonByIdUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(getPersonByIdUseCaseSpy).toHaveBeenCalledWith({
      id,
    })
    expect(response).toEqual({
      statusCode: 200,
      data: {
        person: personDTOStub,
      },
    })
  })
})
