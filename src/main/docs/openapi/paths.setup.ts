import { type OpenAPIV3_1 } from 'openapi-types'

import {
  signInPath,
  signUpPath,
} from '@/main/docs/openapi/paths/authentication'
import {
  fetchNotificationsByRecipientPath,
  readNotificationPath,
} from '@/main/docs/openapi/paths/notifications'
import {
  fetchUsersPath,
  getUserByIdPath,
} from '@/main/docs/openapi/paths/users'

export default {
  '/signin': signInPath,
  '/signup': signUpPath,
  '/users': fetchUsersPath,
  '/users/{id}': getUserByIdPath,
  '/notifications/recipient/{recipientId}': fetchNotificationsByRecipientPath,
  '/notifications/{id}/read': readNotificationPath,
} satisfies Record<string, OpenAPIV3_1.PathItemObject>
