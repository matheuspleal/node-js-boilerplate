import { resolveOffsetByPageParams } from '@/core/infra/repositories/helpers/resolve-offset-by-pagination-params'

describe('ResolveOffsetByPaginationParams', () => {
  it('should be able to resolve offset by pagination params', () => {
    const offset = resolveOffsetByPageParams({
      number: 1,
      size: 20,
    })

    expect(offset).toEqual(0)
  })

  it('should be able to resolve offset by pagination params', () => {
    const offset = resolveOffsetByPageParams({
      number: 2,
      size: 20,
    })

    expect(offset).toEqual(20)
  })
})
