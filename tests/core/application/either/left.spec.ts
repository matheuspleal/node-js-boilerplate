import { anyFunctionWithEitherReturn } from '#/core/application/@mocks/any-function-with-either-return'

describe('Left', () => {
  it('should be able to return error', () => {
    const isSuccess = false
    const result = anyFunctionWithEitherReturn(isSuccess)

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toEqual('any_error')
  })
})
