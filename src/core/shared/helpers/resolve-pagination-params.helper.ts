import {
  DEFAULT_PAGE_NUMBER,
  MAX_PAGE_SIZE,
} from '@/core/shared/constants/pagination-params.const'
import { type PaginationParams } from '@/core/shared/types/pagination-params.type'

function resolvePageNumber(number?: number): number {
  if (!number || number < 0) {
    return DEFAULT_PAGE_NUMBER
  }
  return number
}

function resolvePageSize(size?: number): number {
  if (!size || size < 0 || size > MAX_PAGE_SIZE) {
    return MAX_PAGE_SIZE
  }
  return size
}

export interface ResolvePaginationParamsProps {
  number?: number
  size?: number
}

export function resolvePaginationParams(
  resolvePaginationParams?: ResolvePaginationParamsProps,
): PaginationParams {
  return {
    number: resolvePageNumber(resolvePaginationParams?.number),
    size: resolvePageSize(resolvePaginationParams?.size),
  }
}
