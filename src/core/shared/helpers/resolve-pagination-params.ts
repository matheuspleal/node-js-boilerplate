import {
  DEFAULT_PAGE,
  MAX_LIMIT,
} from '@/core/shared/constants/pagination-params'
import { PaginationParams } from '@/core/shared/types/pagination-params'

function resolvePage(page?: number): number {
  if (!page || page < 0) {
    return DEFAULT_PAGE
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
