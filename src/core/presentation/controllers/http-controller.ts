import { BaseController } from '@/core/presentation/controllers/base-controller'
import {
  badRequest,
  serverError,
} from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'

export abstract class HttpController<HttpRequest, Data> extends BaseController<
  HttpRequest,
  HttpResponse<Data>
> {
  abstract perform(request: HttpRequest): Promise<HttpResponse<Data>>

  override async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validate(request)
    if (error !== undefined) {
      return badRequest(error)
    }
    try {
      return await this.perform(request)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
