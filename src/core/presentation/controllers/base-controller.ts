import { CompositeValidator } from '@/core/presentation/validators/composite-validator'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { type Validator } from '@/core/presentation/validators/validator'

export abstract class BaseController<GenericRequest, GenericResponse> {
  abstract handle(request: GenericRequest): Promise<GenericResponse>

  buildValidators(request: GenericRequest): Validator[] {
    return []
  }

  protected validate(request: GenericRequest): ValidationError | undefined {
    const validators = this.buildValidators(request)
    return new CompositeValidator(validators).validate()
  }
}
