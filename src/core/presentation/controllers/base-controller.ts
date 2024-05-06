import { CompositeValidator } from '@/core/presentation/validators/composite-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export abstract class BaseController<GenericRequest, GenericResponse> {
  abstract handle(request: GenericRequest): Promise<GenericResponse>

  buildValidators(request: GenericRequest): ValidatorRule[] {
    return []
  }

  protected validate(request: GenericRequest): ValidationError[] | undefined {
    const validators = this.buildValidators(request)
    return new CompositeValidator(validators).run()
  }
}
