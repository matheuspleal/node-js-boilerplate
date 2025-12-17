import { HttpController } from '@/core/presentation/controllers/http.controller'
import { ok } from '@/core/presentation/helpers/http.helper'
import { type HttpResponse } from '@/core/presentation/protocols/http.protocol'
import { resolvePaginationParams } from '@/core/shared/helpers/resolve-pagination-params.helper'
import { type PersonCollectionDTO } from '@/modules/persons/application/use-cases/dtos/person.dto'
import { type FetchPersonsUseCase } from '@/modules/persons/application/use-cases/fetch-persons.use-case'

export interface FetchPersonsControllerRequest {
  'page[number]'?: number
  'page[size]'?: number
}

export interface FetchPersonsControllerResponse {
  count: number
  persons: PersonCollectionDTO
}

export class FetchPersonsController extends HttpController<
  FetchPersonsControllerRequest,
  FetchPersonsControllerResponse
> {
  constructor(private readonly fetchPersonsUseCase: FetchPersonsUseCase) {
    super()
  }

  override async perform(
    request: FetchPersonsControllerRequest,
  ): Promise<HttpResponse<FetchPersonsControllerResponse>> {
    const result = await this.fetchPersonsUseCase.execute({
      paginationParams: resolvePaginationParams({
        number: Number(request?.['page[number]']),
        size: Number(request?.['page[size]']),
      }),
    })
    return ok<FetchPersonsControllerResponse>({
      count: result.value?.count!,
      persons: result.value?.persons!,
    })
  }
}
