import { resolvePaginationParams } from '@/core/shared/helpers/resolve-pagination-params.helper'

describe('ResolvePaginationParams', () => {
  it('should be able to resolve pagination params when page number is not provided', () => {
    const paginationParams = resolvePaginationParams({ size: 20 })

    expect(paginationParams).toEqual({
      number: 1,
      size: 20,
    })
  })

  it('should be able to resolve pagination params when page size is not provided', () => {
    const paginationParams = resolvePaginationParams({ number: 1 })

    expect(paginationParams).toEqual({
      number: 1,
      size: 20,
    })
  })

  it('should be able to resolve pagination params when page number and page size are not provided', () => {
    const paginationParams = resolvePaginationParams()

    expect(paginationParams).toEqual({
      number: 1,
      size: 20,
    })
  })

  it('should be able to resolve pagination params when valid page number and page size are provided', () => {
    const paginationParams = resolvePaginationParams({
      number: 2,
      size: 15,
    })

    expect(paginationParams).toEqual({
      number: 2,
      size: 15,
    })
  })

  it('should be able to resolve pagination params when invalid page number are provided', () => {
    const paginationParams = resolvePaginationParams({
      number: -10,
    })

    expect(paginationParams).toEqual({
      number: 1,
      size: 20,
    })
  })

  it('should be able to resolve pagination params when invalid page size are provided', () => {
    const paginationParams = resolvePaginationParams({
      size: 100,
    })

    expect(paginationParams).toEqual({
      number: 1,
      size: 20,
    })
  })

  it('should be able to resolve pagination params when valid page number and page size are provided', () => {
    const paginationParams = resolvePaginationParams({
      number: 2,
      size: 15,
    })

    expect(paginationParams).toEqual({
      number: 2,
      size: 15,
    })
  })
})
