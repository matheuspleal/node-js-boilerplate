import { BaseController } from '@/core/presentation/controllers/base-controller'
import {
  serverError,
  badValidatorRequest,
} from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'

export abstract class HttpController<HttpRequest, Data> extends BaseController<
  HttpRequest,
  HttpResponse<Data>
> {
  abstract perform(request: HttpRequest): Promise<HttpResponse<Data>>

  override async handle(request: HttpRequest): Promise<HttpResponse> {
    const errors = this.validate(request)
    if (errors !== undefined) {
      return badValidatorRequest(errors)
    }
    try {
      return await this.perform(request)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
