import { type Either, left, type Right, right } from '@/core/shared/either'

type ExtractLeft<T> = T extends Either<infer L, unknown> ? L : never

type ExtractRight<T> = T extends Either<unknown, infer R> ? R : never

type ExtractLefts<T extends Either<unknown, unknown>[]> = ExtractLeft<T[number]>

type ExtractRights<T extends Either<unknown, unknown>[]> = {
  [K in keyof T]: ExtractRight<T[K]>
}

export function combine<T extends Either<unknown, unknown>[]>(
  eithers: [...T],
): Either<ExtractLefts<T>, ExtractRights<T>> {
  const values: unknown[] = []
  for (const either of eithers) {
    if (either.isLeft()) {
      return left(either.value) as Either<ExtractLefts<T>, ExtractRights<T>>
    }
    values.push((either as Right<unknown, unknown>).value)
  }
  return right(values) as Either<ExtractLefts<T>, ExtractRights<T>>
}
