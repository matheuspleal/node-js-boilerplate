import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { buildErrorMessage } from '@/core/presentation/validators/helpers/build-error-message'
import { copyAndReturnPropsOfListOfFields } from '@/core/presentation/validators/helpers/copy-and-return-props-of-list-of-fields'

export class InvalidPasswordError extends Error implements ValidationError {
  constructor(readonly listOfFields: string[]) {
    const { length, listOfFieldsCopy, lastField } =
      copyAndReturnPropsOfListOfFields(listOfFields)
    super(
      buildErrorMessage({
        length,
        listOfFieldsCopy,
        lastField,
        reason:
          'The password must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character',
      }),
    )
    this.name = 'InvalidPasswordError'
  }
}
