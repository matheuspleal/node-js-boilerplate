import { ServerError } from '@/core/presentation/errors/server-error'
import { HttpResponse } from '@/core/presentation/protocols/http'

export function ok<T = any>(body: T): HttpResponse<T> {
  return {
    statusCode: 200,
    body,
  }
}

export function created<T = any>(body: T): HttpResponse<T> {
  return {
    statusCode: 201,
    body,
  }
}

export function badRequest(error: Error): HttpResponse<Error> {
  return {
    statusCode: 400,
    body: error,
  }
}

export function serverError(error: Error): HttpResponse<Error> {
  return {
    statusCode: 500,
    body: new ServerError(error),
  }
}
