import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'
import { ServerError } from '@/core/presentation/errors/server-error'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite-error'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { type UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'

export function ok<T = any>(data: T): HttpResponse<T> {
  return {
    statusCode: 200,
    data,
  }
}

export function created<T = any>(data: T): HttpResponse<T> {
  return {
    statusCode: 201,
    data,
  }
}

export function badValidatorRequest(
  errors: ValidationError | ValidationError[],
): HttpResponse<ValidationCompositeError> {
  const listOfErrors = Array.isArray(errors) ? errors : [errors]
  return {
    statusCode: 400,
    data: new ValidationCompositeError(listOfErrors),
  }
}

export function badDomainRequest(
  error: UseCaseError,
): HttpResponse<UseCaseError> {
  return {
    statusCode: 400,
    data: error,
  }
}

export function unauthorizedError(
  error: UnauthorizedError,
): HttpResponse<Error> {
  return {
    statusCode: 401,
    data: error,
  }
}

export function notFoundError(error: Error): HttpResponse<Error> {
  return {
    statusCode: 404,
    data: error,
  }
}

export function serverError(error: Error): HttpResponse<Error> {
  return {
    statusCode: 500,
    data: new ServerError(error),
  }
}
