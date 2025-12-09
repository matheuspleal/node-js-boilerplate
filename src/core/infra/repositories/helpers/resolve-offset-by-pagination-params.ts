import { type PaginationParams } from '@/core/shared/types/pagination-params.type'

export function resolveOffsetByPageAndLimit({ page, limit }: PaginationParams) {
  return (page - 1) * limit
}
