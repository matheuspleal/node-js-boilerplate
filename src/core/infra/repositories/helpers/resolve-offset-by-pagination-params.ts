import { type PaginationParams } from '@/core/shared/types/pagination-params.type'

export function resolveOffsetByPageParams({ number, size }: PaginationParams) {
  return (number - 1) * size
}
