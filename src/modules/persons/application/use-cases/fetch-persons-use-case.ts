import { type Either, right } from '@/core/application/either'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { type PaginationParams } from '@/core/shared/types/pagination-params'
import { type CountPersonsRepository } from '@/modules/persons/application/repositories/count-persons-repository'
import { type FindManyPersonsRepository } from '@/modules/persons/application/repositories/find-many-persons-repository'
import { type PersonCollectionDTO } from '@/modules/persons/application/use-cases/dtos/person-dto'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'

export interface FetchPersonsUseCaseInput {
  paginationParams: PaginationParams
}

export type FetchPersonsUseCaseOutput = Either<
  null,
  {
    count: number
    persons: PersonCollectionDTO
  }
>

export class FetchPersonsUseCase
  implements UseCase<FetchPersonsUseCaseInput, FetchPersonsUseCaseOutput>
{
  constructor(
    private readonly countPersonsRepository: CountPersonsRepository,
    private readonly findManyPersonsRepository: FindManyPersonsRepository,
  ) {}

  async execute({
    paginationParams,
  }: FetchPersonsUseCaseInput): Promise<FetchPersonsUseCaseOutput> {
    const [count, persons] = await Promise.all([
      this.countPersonsRepository.count(),
      this.findManyPersonsRepository.findMany(paginationParams),
    ])
    return right({
      count,
      persons: PersonMapper.toCollectionDTO(persons),
    })
  }
}
