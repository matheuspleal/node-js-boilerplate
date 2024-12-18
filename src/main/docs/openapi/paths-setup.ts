import { type OpenAPIV3_1 } from 'openapi-types'

import {
  signInPath,
  signUpPath,
} from '@/main/docs/openapi/paths/authentication'
import {
  fetchPersonsPath,
  getPersonByIdPath,
} from '@/main/docs/openapi/paths/persons'

export default {
  '/signin': signInPath,
  '/signup': signUpPath,
  '/persons': fetchPersonsPath,
  '/persons/{id}': getPersonByIdPath,
} satisfies Record<string, OpenAPIV3_1.PathItemObject>
