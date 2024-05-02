export interface HttpResponse<T = any> {
  statusCode: number
  data: T
}
