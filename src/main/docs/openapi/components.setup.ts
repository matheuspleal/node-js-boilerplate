import { type OpenAPIV3_1 } from 'openapi-types'

import {
  pageSizeParams,
  pageNumberParams,
} from '@/main/docs/openapi/components/parameters'
import {
  notificationIdParam,
  recipientIdParam,
} from '@/main/docs/openapi/components/parameters/notifications'
import { userIdParam } from '@/main/docs/openapi/components/parameters/users'
import {
  badRequest,
  conflict,
  notFound,
  serverError,
  unauthorized,
} from '@/main/docs/openapi/components/responses'
import { errorSchema } from '@/main/docs/openapi/components/schemas'
import {
  accessTokenSchema,
  signInRequestSchema,
  signUpRequestSchema,
  signUpResponseSchema,
} from '@/main/docs/openapi/components/schemas/authentication'
import {
  fetchNotificationsResponseSchema,
  notificationResponseSchema,
} from '@/main/docs/openapi/components/schemas/notifications'
import {
  fetchUsersResponseSchema,
  userResponseSchema,
} from '@/main/docs/openapi/components/schemas/users'
import { bearerAuthSecurityScheme } from '@/main/docs/openapi/components/security-schemes'

const responses: Record<string, OpenAPIV3_1.ResponseObject> = {
  badRequest,
  conflict,
  serverError,
  notFound,
  unauthorized,
}

const schemas: Record<string, OpenAPIV3_1.SchemaObject> = {
  error: errorSchema,
  accessToken: accessTokenSchema,
  signInRequest: signInRequestSchema,
  signUpRequest: signUpRequestSchema,
  signUpResponse: signUpResponseSchema,
  fetchUsersResponse: fetchUsersResponseSchema,
  userResponse: userResponseSchema,
  fetchNotificationsResponse: fetchNotificationsResponseSchema,
  notificationResponse: notificationResponseSchema,
}

export const securitySchemes: Record<string, OpenAPIV3_1.SecuritySchemeObject> =
  {
    bearerAuth: bearerAuthSecurityScheme,
  }

const parameters: Record<string, OpenAPIV3_1.ParameterObject> = {
  pageSize: pageSizeParams,
  pageNumber: pageNumberParams,
  userId: userIdParam,
  notificationId: notificationIdParam,
  recipientId: recipientIdParam,
}

export default {
  responses,
  schemas,
  parameters,
  securitySchemes,
} satisfies OpenAPIV3_1.ComponentsObject
