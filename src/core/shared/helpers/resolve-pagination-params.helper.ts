import {
  DEFAULT_OFFSET,
  MAX_LIMIT,
} from '@/core/shared/constants/pagination-params.const'
import { type PaginationParams } from '@/core/shared/types/pagination-params.type'

function resolvePage(page?: number): number {
  if (!page || page < 0) {
    return DEFAULT_OFFSET
  }
  return page
}

function resolveLimit(limit?: number): number {
  if (!limit || limit < 0 || limit > 20) {
    return MAX_LIMIT
  }
  return limit
}

export interface ResolvePaginationParamsProps {
  page?: number
  limit?: number
}

export function resolvePaginationParams(
  resolvePaginationParams?: ResolvePaginationParamsProps,
): PaginationParams {
  return {
    page: resolvePage(resolvePaginationParams?.page),
    limit: resolveLimit(resolvePaginationParams?.limit),
  }
}
