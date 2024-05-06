import { type Either, left, right } from '@/core/application/either'
import { type UseCase } from '@/core/application/use-cases/use-case'

class FakeError extends Error {
  constructor() {
    super()
  }
}

interface FakeUseCaseInput {
  isSuccess: boolean
}

type FakeUseCaseOutput = Either<
  FakeError,
  {
    isSuccess: boolean
  }
>

class FakeUseCase implements UseCase<FakeUseCaseInput, FakeUseCaseOutput> {
  async execute({ isSuccess }: FakeUseCaseInput): Promise<FakeUseCaseOutput> {
    if (!isSuccess) {
      return Promise.resolve(left(new FakeError()))
    }
    return Promise.resolve(right({ isSuccess }))
  }
}

describe('UseCase', () => {
  let sut: FakeUseCase

  beforeAll(() => {
    sut = new FakeUseCase()
  })

  it('should be able to implements a UseCase interface using Either to return the result', async () => {
    {
      const result = await sut.execute({ isSuccess: false })
      expect(result.isLeft()).toBe(true)
      expect(result.isRight()).toBe(false)
      expect(result.value).toBeInstanceOf(FakeError)
    }
    {
      const result = await sut.execute({ isSuccess: true })
      expect(result.isLeft()).toBe(false)
      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({ isSuccess: true })
    }
  })
})
