import { type OpenAPIV3_1 } from 'openapi-types'

export const bearerAuthSecurityScheme: OpenAPIV3_1.SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
}
