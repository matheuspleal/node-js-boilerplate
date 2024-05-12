import { StatusCode } from '@/core/presentation/helpers/http-helpers'

export function setGraphQLCodeFromStatusCode(statusCode: number) {
  switch (statusCode) {
    case StatusCode.BAD_REQUEST:
      return 'DOMAIN_VALIDATION_ERROR'
    case StatusCode.UNAUTHORIZED:
      return 'UNAUTHORIZED'
    case StatusCode.NOT_FOUND:
      return 'NOT_FOUND'
    case StatusCode.CONFLICT:
      return 'CONFLICT'
    default:
      return 'INTERNAL_SERVER_ERROR'
  }
}
