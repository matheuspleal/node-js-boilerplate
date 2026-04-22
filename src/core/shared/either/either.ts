export class Left<L, R> {
  constructor(public readonly value: L) {}

  isLeft(): this is Left<L, R> {
    return true
  }

  isRight(): this is Right<L, R> {
    return false
  }
}

export class Right<L, R> {
  constructor(public readonly value: R) {}

  isLeft(): this is Left<L, R> {
    return false
  }

  isRight(): this is Right<L, R> {
    return true
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export function left<L, R>(value: L): Either<L, R> {
  return new Left(value)
}

export function right<L, R>(value: R): Either<L, R> {
  return new Right(value)
}
