import { Either, left, right } from '@/core/application/either'

export function anyFunctionWithEitherReturn(
  isSuccess: boolean,
): Either<string, string> {
  if (isSuccess) {
    return right('any_success')
  } else {
    return left('any_error')
  }
}
