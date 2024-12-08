import { resolvePaginationParams } from '@/core/shared/helpers/resolve-pagination-params'

describe('ResolvePaginationParams', () => {
  it('should be able to resolve pagination params when page is not provided', () => {
    const paginationParams = resolvePaginationParams({ limit: 20 })

    expect(paginationParams).toEqual({
      page: 1,
      limit: 20,
    })
  })

  it('should be able to resolve pagination params when limit is not provided', () => {
    const paginationParams = resolvePaginationParams({ page: 1 })

    expect(paginationParams).toEqual({
      page: 1,
      limit: 20,
    })
  })

  it('should be able to resolve pagination params when page and limit are not provided', () => {
    const paginationParams = resolvePaginationParams()

    expect(paginationParams).toEqual({
      page: 1,
      limit: 20,
    })
  })

  it('should be able to resolve pagination params when valid page and limit are provided', () => {
    const paginationParams = resolvePaginationParams({
      page: 2,
      limit: 15,
    })

    expect(paginationParams).toEqual({
      page: 2,
      limit: 15,
    })
  })

  it('should be able to resolve pagination params when invalid page are provided', () => {
    const paginationParams = resolvePaginationParams({
      page: -10,
    })

    expect(paginationParams).toEqual({
      page: 1,
      limit: 20,
    })
  })

  it('should be able to resolve pagination params when invalid limit are provided', () => {
    const paginationParams = resolvePaginationParams({
      limit: 100,
    })

    expect(paginationParams).toEqual({
      page: 1,
      limit: 20,
    })
  })

  it('should be able to resolve pagination params when valid page and limit are provided', () => {
    const paginationParams = resolvePaginationParams({
      page: 2,
      limit: 15,
    })

    expect(paginationParams).toEqual({
      page: 2,
      limit: 15,
    })
  })
})
