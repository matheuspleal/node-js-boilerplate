import { type Either, left, right } from '@/core/application/either'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { PersonNotFoundError } from '@/modules/persons/application/errors/person-not-found-error'
import { type FindPersonByIdRepository } from '@/modules/persons/application/repositories/find-person-by-id-repository'
import { type PersonDTO } from '@/modules/persons/application/use-cases/dtos/person-dto'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'

export interface GetPersonByIdUseCaseInput {
  id: string
}

export type GetPersonByIdUseCaseOutput = Either<
  PersonNotFoundError,
  {
    person: PersonDTO
  }
>

export class GetPersonByIdUseCase
  implements UseCase<GetPersonByIdUseCaseInput, GetPersonByIdUseCaseOutput>
{
  constructor(
    private readonly findPersonByIdRepository: FindPersonByIdRepository,
  ) {}

  async execute({
    id,
  }: GetPersonByIdUseCaseInput): Promise<GetPersonByIdUseCaseOutput> {
    const user = await this.findPersonByIdRepository.findById(id)
    if (!user) {
      return left(new PersonNotFoundError(id))
    }
    return right({
      person: PersonMapper.toDTO(user),
    })
  }
}
