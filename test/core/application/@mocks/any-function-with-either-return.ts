import { type Either, left, right } from '@/core/shared/either'

export function anyFunctionWithEitherReturn(
  isSuccess: boolean,
): Either<string, string> {
  if (isSuccess) {
    return right('any_success')
  } else {
    return left('any_error')
  }
}
