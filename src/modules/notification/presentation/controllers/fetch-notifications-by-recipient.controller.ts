import { HttpController } from '@/core/presentation/controllers/http.controller'
import { ok } from '@/core/presentation/helpers/http.helper'
import { type HttpResponse } from '@/core/presentation/protocols/http.protocol'
import { BuilderValidator } from '@/core/presentation/validators/builder.validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule.contract'
import { type NotificationCollectionDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { type FetchNotificationsByRecipientUseCase } from '@/modules/notification/application/use-cases/fetch-notifications-by-recipient.use-case'

export interface FetchNotificationsByRecipientControllerRequest {
  recipientId: string
}

export interface FetchNotificationsByRecipientControllerResponse {
  count: number
  notifications: NotificationCollectionDTO
}

export class FetchNotificationsByRecipientController extends HttpController<
  FetchNotificationsByRecipientControllerRequest,
  FetchNotificationsByRecipientControllerResponse
> {
  constructor(
    private readonly fetchNotificationsByRecipientUseCase: FetchNotificationsByRecipientUseCase,
  ) {
    super()
  }

  override buildValidators(
    request: FetchNotificationsByRecipientControllerRequest,
  ): ValidatorRule[] {
    return BuilderValidator.of({
      name: 'recipientId',
      value: request.recipientId,
    })
      .required()
      .isValidUUID()
      .build()
  }

  override async perform(
    request: FetchNotificationsByRecipientControllerRequest,
  ): Promise<HttpResponse<FetchNotificationsByRecipientControllerResponse>> {
    const result = await this.fetchNotificationsByRecipientUseCase.execute({
      recipientId: request.recipientId,
    })
    return ok<FetchNotificationsByRecipientControllerResponse>(result.value)
  }
}
