import { type HttpResponse } from '@/core/presentation/protocols/http.protocol'

export interface Middleware<HttpRequest> {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
