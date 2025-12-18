import { type OpenAPIV3_1 } from 'openapi-types'

export const pageNumberParams: OpenAPIV3_1.ParameterObject = {
  name: 'page[number]',
  description: 'Defines the starting page number for fetching records',
  in: 'query',
  required: false,
  example: 1,
}
