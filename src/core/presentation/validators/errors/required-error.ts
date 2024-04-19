import { ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { buildErrorMessage } from '@/core/presentation/validators/helpers/build-error-message'
import { copyAndReturnPropsOfListOfFields } from '@/core/presentation/validators/helpers/copy-and-return-props-of-list-of-fields'

export class RequiredError extends Error implements ValidationError {
  constructor(readonly listOfFields: string[]) {
    const { length, listOfFieldsCopy, lastField } =
      copyAndReturnPropsOfListOfFields(listOfFields)
    super(
      buildErrorMessage({
        length,
        listOfFieldsCopy,
        lastField,
        reason: 'required',
      }),
    )
    this.name = 'RequiredError'
  }
}
