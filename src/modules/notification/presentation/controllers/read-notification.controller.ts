import { HttpController } from '@/core/presentation/controllers/http.controller'
import { notFound, ok } from '@/core/presentation/helpers/http.helper'
import { type HttpResponse } from '@/core/presentation/protocols/http.protocol'
import { BuilderValidator } from '@/core/presentation/validators/builder.validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule.contract'
import { type NotificationDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { type ReadNotificationUseCase } from '@/modules/notification/application/use-cases/read-notification.use-case'
import { type NotificationNotFoundError } from '@/modules/notification/domain/errors/notification-not-found.error'

export interface ReadNotificationControllerRequest {
  id: string
}

export type ReadNotificationControllerResponse =
  | NotificationNotFoundError
  | { notification: NotificationDTO }

export class ReadNotificationController extends HttpController<
  ReadNotificationControllerRequest,
  ReadNotificationControllerResponse
> {
  constructor(
    private readonly readNotificationUseCase: ReadNotificationUseCase,
  ) {
    super()
  }

  override buildValidators(
    request: ReadNotificationControllerRequest,
  ): ValidatorRule[] {
    return BuilderValidator.of({
      name: 'id',
      value: request.id,
    })
      .required()
      .isValidUUID()
      .build()
  }

  override async perform({
    id,
  }: ReadNotificationControllerRequest): Promise<
    HttpResponse<ReadNotificationControllerResponse>
  > {
    const result = await this.readNotificationUseCase.execute({ id })
    if (result.isLeft()) {
      return notFound(result.value)
    }
    return ok<ReadNotificationControllerResponse>(result.value)
  }
}
