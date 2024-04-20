import { type PropsOfListOfFields } from '@/core/presentation/validators/helpers/props-of-list-of-fields'

export function copyAndReturnPropsOfListOfFields(
  listOfFields: string[],
): PropsOfListOfFields {
  const length = listOfFields.length
  const listOfFieldsCopy = [...listOfFields]
  const lastField = listOfFieldsCopy.pop()
  return {
    length,
    listOfFieldsCopy,
    lastField,
  }
}
