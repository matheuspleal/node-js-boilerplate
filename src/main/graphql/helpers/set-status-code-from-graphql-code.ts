import { StatusCode } from '@/core/presentation/helpers/http-helpers'

export function setStatusCodeFromGraphQLCode(code?: string) {
  switch (code) {
    case 'BAD_USER_INPUT':
    case 'DOMAIN_VALIDATION_ERROR':
      return StatusCode.BAD_REQUEST
    case 'UNAUTHORIZED':
      return StatusCode.UNAUTHORIZED
    case 'NOT_FOUND':
      return StatusCode.NOT_FOUND
    case 'CONFLICT':
      return StatusCode.CONFLICT
    default:
      return StatusCode.SERVER_ERROR
  }
}
