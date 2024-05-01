import { resolveOffsetByPageAndLimit } from '@/core/infra/repositories/helpers/resolve-offset-by-pagination-params'

describe('ResolveOffsetByPaginationParams', () => {
  it('should be able to resolve offset by pagination params', () => {
    const offset = resolveOffsetByPageAndLimit({
      page: 1,
      limit: 20,
    })

    expect(offset).toEqual(0)
  })

  it('should be able to resolve offset by pagination params', () => {
    const offset = resolveOffsetByPageAndLimit({
      page: 2,
      limit: 20,
    })

    expect(offset).toEqual(20)
  })
})
