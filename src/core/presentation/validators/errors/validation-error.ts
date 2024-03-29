export interface ValidationError extends Error {
  listOfFields: string[]
}
