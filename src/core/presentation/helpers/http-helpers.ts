import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'
import { InternalServerError } from '@/core/presentation/errors/internal-server-error'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite-error'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { UnauthorizedError } from '@/modules/persons/application/errors/unauthorized-error'

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export function ok<T = any>(data: T): HttpResponse<T> {
  return {
    statusCode: StatusCode.OK,
    data,
  }
}

export function created<T = any>(data: T): HttpResponse<T> {
  return {
    statusCode: StatusCode.CREATED,
    data,
  }
}

export function noContent(): HttpResponse<undefined> {
  return {
    statusCode: StatusCode.NO_CONTENT,
    data: undefined,
  }
}

export function badValidatorRequest(
  errors: ValidationError | ValidationError[],
): HttpResponse<ValidationCompositeError> {
  const listOfErrors = Array.isArray(errors) ? errors : [errors]
  return {
    statusCode: StatusCode.BAD_REQUEST,
    data: new ValidationCompositeError(listOfErrors),
  }
}

export function badDomainRequest(
  error: UseCaseError,
): HttpResponse<UseCaseError> {
  return {
    statusCode: StatusCode.BAD_REQUEST,
    data: error,
  }
}

export function conflict(error: UseCaseError): HttpResponse<UseCaseError> {
  return {
    statusCode: StatusCode.CONFLICT,
    data: error,
  }
}

export function unauthorized(): HttpResponse<Error> {
  return {
    statusCode: StatusCode.UNAUTHORIZED,
    data: new UnauthorizedError(),
  }
}

export function notFound(error: Error): HttpResponse<Error> {
  return {
    statusCode: StatusCode.NOT_FOUND,
    data: error,
  }
}

export function serverError(error?: unknown): HttpResponse<Error> {
  return {
    statusCode: StatusCode.SERVER_ERROR,
    data: new InternalServerError(error instanceof Error ? error : undefined),
  }
}
