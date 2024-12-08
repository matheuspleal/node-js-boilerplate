import { type HttpResponse } from '@/core/presentation/protocols/http'

export interface Middleware<HttpRequest> {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
