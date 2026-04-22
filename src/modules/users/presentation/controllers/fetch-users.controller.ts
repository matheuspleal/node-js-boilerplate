import { HttpController } from '@/core/presentation/controllers/http.controller'
import { ok } from '@/core/presentation/helpers/http.helper'
import { type HttpResponse } from '@/core/presentation/protocols/http.protocol'
import { resolvePaginationParams } from '@/core/shared/helpers/resolve-pagination-params.helper'
import { type UserCollectionDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { type FetchUsersUseCase } from '@/modules/users/application/use-cases/fetch-users.use-case'

export interface FetchUsersControllerRequest {
  'page[number]'?: number
  'page[size]'?: number
}

export interface FetchUsersControllerResponse {
  count: number
  users: UserCollectionDTO
}

export class FetchUsersController extends HttpController<
  FetchUsersControllerRequest,
  FetchUsersControllerResponse
> {
  constructor(private readonly fetchUsersUseCase: FetchUsersUseCase) {
    super()
  }

  override async perform(
    request: FetchUsersControllerRequest,
  ): Promise<HttpResponse<FetchUsersControllerResponse>> {
    const result = await this.fetchUsersUseCase.execute({
      paginationParams: resolvePaginationParams({
        number: Number(request?.['page[number]']),
        size: Number(request?.['page[size]']),
      }),
    })
    return ok<FetchUsersControllerResponse>(result.value)
  }
}
