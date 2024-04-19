import { PropsOfListOfFields } from '@/core/presentation/validators/helpers/props-of-list-of-fields'

export interface Message {
  reason: string
}

export function buildErrorMessage({
  length,
  listOfFieldsCopy,
  lastField,
  reason,
}: PropsOfListOfFields & Message): string {
  const message =
    length > 1
      ? `The fields: "${listOfFieldsCopy.join(', ')}" and "${lastField}" are ${reason}!`
      : `The field: "${lastField}" is ${reason}!`
  return message
}
