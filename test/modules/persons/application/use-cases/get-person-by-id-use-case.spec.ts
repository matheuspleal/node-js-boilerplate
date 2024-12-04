import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { PersonNotFoundError } from '@/modules/persons/application/errors/person-not-found-error'
import { type FindPersonByIdRepository } from '@/modules/persons/application/repositories/find-person-by-id-repository'
import { GetPersonByIdUseCase } from '@/modules/persons/application/use-cases/get-person-by-id-use-case'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'

import { makePersonEntityStub } from '#/modules/persons/domain/@mocks/person-entity-stub'

describe('GetPersonByIdUseCase', () => {
  let sut: GetPersonByIdUseCase
  let personEntityStub: PersonEntity
  let findPersonByIdRepositoryMock: MockProxy<FindPersonByIdRepository>
  let findPersonByIdRepositorySpy: MockInstance<
    [string],
    Promise<PersonEntity | null>
  >

  beforeAll(() => {
    personEntityStub = makePersonEntityStub()
    findPersonByIdRepositoryMock = mock<FindPersonByIdRepository>()
    findPersonByIdRepositoryMock.findById.mockResolvedValue(personEntityStub)
  })

  beforeEach(() => {
    findPersonByIdRepositorySpy = vi.spyOn(
      findPersonByIdRepositoryMock,
      'findById',
    )
    sut = new GetPersonByIdUseCase(findPersonByIdRepositoryMock)
  })

  it('should be able to returns PersonNotFoundError when person id not found', async () => {
    findPersonByIdRepositoryMock.findById.mockResolvedValueOnce(null)
    const id = 'fake-non-existent-id'

    const result = await sut.execute({ id })

    expect(findPersonByIdRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findPersonByIdRepositorySpy).toHaveBeenCalledWith(id)
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PersonNotFoundError)
  })

  it('should be able to get an person by id', async () => {
    const id = personEntityStub.id.toString()
    const expectedValue = PersonMapper.toDTO(personEntityStub)

    const result = await sut.execute({ id })

    expect(findPersonByIdRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findPersonByIdRepositorySpy).toHaveBeenCalledWith(id)
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ person: expectedValue })
  })
})
