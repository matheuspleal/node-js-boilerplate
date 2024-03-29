import { ValidationError } from '@/core/presentation/validators/errors/validation-error'

export class RequiredFieldError extends Error implements ValidationError {
  constructor(readonly listOfFields: string[]) {
    const listOfFieldsCopy = [...listOfFields]
    const lastField = listOfFieldsCopy.pop()
    const message =
      listOfFields.length > 1
        ? `The fields: "${listOfFieldsCopy.join(', ')} and ${lastField}" are required!`
        : `The field: "${lastField}" is required!`
    super(message)
    this.name = 'RequiredFieldError'
  }
}
