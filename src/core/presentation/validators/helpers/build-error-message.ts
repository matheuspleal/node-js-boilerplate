export interface BuildMessageProps<T> {
  field: string
  value?: T
  reason: string
}

export function buildErrorMessage<T = unknown>({
  field,
  value,
  reason,
}: BuildMessageProps<T>): string {
  return value
    ? `The field "${field}" with value "${String(value)}" ${reason}`
    : `The field "${field}" ${reason}`
}
