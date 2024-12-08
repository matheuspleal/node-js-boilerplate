import { type OpenAPIV3_1 } from 'openapi-types'

import {
  filterLimitParams,
  filterOffsetParams,
} from '@/main/docs/openapi/components/parameters'
import { userIdParam } from '@/main/docs/openapi/components/parameters/users'
import {
  badRequest,
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
  fetchUsersResponseSchema,
  userResponseSchema,
} from '@/main/docs/openapi/components/schemas/users'
import { bearerAuthSecurityScheme } from '@/main/docs/openapi/components/security-schemes'

const responses: Record<string, OpenAPIV3_1.ResponseObject> = {
  badRequest,
  serverError,
  unauthorized,
  notFound,
}

const schemas: Record<string, OpenAPIV3_1.SchemaObject> = {
  error: errorSchema,
  accessToken: accessTokenSchema,
  signInRequest: signInRequestSchema,
  signUpRequest: signUpRequestSchema,
  signUpResponse: signUpResponseSchema,
  fetchUsersResponse: fetchUsersResponseSchema,
  userResponse: userResponseSchema,
}

export const securitySchemes: Record<string, OpenAPIV3_1.SecuritySchemeObject> =
  {
    bearerAuth: bearerAuthSecurityScheme,
  }

const parameters: Record<string, OpenAPIV3_1.ParameterObject> = {
  filterLimit: filterLimitParams,
  filterOffset: filterOffsetParams,
  userId: userIdParam,
}

export default {
  responses,
  schemas,
  parameters,
  securitySchemes,
} satisfies OpenAPIV3_1.ComponentsObject
