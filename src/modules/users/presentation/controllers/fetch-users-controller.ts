import { HttpController } from '@/core/presentation/controllers/http-controller'
import { ok } from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { resolvePaginationParams } from '@/core/shared/helpers/resolve-pagination-params'
import { type FetchUsersUseCase } from '@/modules/users/application/use-cases/fetch-users-use-case'
import { type UserCollectionDTO } from '@/modules/users/contracts/dtos/user-dto'

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
        page: request?.['page[offset]'],
        limit: request?.['page[limit]'],
      }),
    })
    return ok<FetchUsers.Response>({
      count: result.value?.count!,
      users: result.value?.users!,
    })
  }
}
