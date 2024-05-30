import { HttpController } from '@/core/presentation/controllers/http-controller'
import { ok } from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { resolvePaginationParams } from '@/core/shared/helpers/resolve-pagination-params'
import { type UserCollectionDTO } from '@/modules/users/application/use-cases/dtos/user-dto'
import { type FetchUsersUseCase } from '@/modules/users/application/use-cases/fetch-users-use-case'

export namespace FetchUsers {
  export interface Request {
    'page[offset]'?: number
    'page[limit]'?: number
  }

  export interface Response {
    count: number
    users: UserCollectionDTO
  }
}

export class FetchUsersController extends HttpController<
  FetchUsers.Request,
  FetchUsers.Response
> {
  constructor(private readonly fetchUsersUseCase: FetchUsersUseCase) {
    super()
  }

  override async perform(
    request: FetchUsers.Request,
  ): Promise<HttpResponse<FetchUsers.Response>> {
    const result = await this.fetchUsersUseCase.execute({
      paginationParams: resolvePaginationParams({
        page: Number(request?.['page[offset]']),
        limit: Number(request?.['page[limit]']),
      }),
    })
    return ok<FetchUsers.Response>({
      count: result.value?.count!,
      users: result.value?.users!,
    })
  }
}
