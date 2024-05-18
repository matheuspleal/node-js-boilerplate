import { type OpenAPIV3_1 } from 'openapi-types'

import {
  signInPath,
  signUpPath,
} from '@/main/docs/openapi/paths/authentication'
import {
  fetchUsersPath,
  getUserByIdPath,
} from '@/main/docs/openapi/paths/users'

export default {
  '/signin': signInPath,
  '/signup': signUpPath,
  '/users': fetchUsersPath,
  '/users/{id}': getUserByIdPath,
} satisfies Record<string, OpenAPIV3_1.PathItemObject>
