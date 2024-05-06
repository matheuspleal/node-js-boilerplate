import { anyFunctionWithEitherReturn } from '#/core/application/@mocks/any-function-with-either-return'

describe('Right', () => {
  it('should be able to return success', () => {
    const isSuccess = true
    const result = anyFunctionWithEitherReturn(isSuccess)

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual('any_success')
  })
})
