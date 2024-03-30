import { PaginationParams } from '@/core/shared/types/pagination-params'

export function resolveOffsetByPageAndLimit({ page, limit }: PaginationParams) {
  return (page - 1) * limit
}
