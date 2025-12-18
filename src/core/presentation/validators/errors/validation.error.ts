export interface ValidationError<T = unknown> {
  name: string
  message: string
  field?: string
  value?: T
}
