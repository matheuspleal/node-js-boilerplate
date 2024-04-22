import { env } from '@/core/shared/config/helpers/env'

export const server = {
  port: env<number>({ key: 'API_PORT', defaultValue: 3333 }),
}

export const api = {
  currentVersion: env<string>({ key: 'VERSION', defaultValue: 'v1' }),
}

export const database = {
  host: env<string>({ key: 'DB_HOST', defaultValue: 'localhost' }),
  port: env<number>({ key: 'DB_PORT', defaultValue: 5432 }),
  name: env<string>({ key: 'DB_NAME', defaultValue: 'node_js_skeleton' }),
  user: env<string>({ key: 'DB_USER', defaultValue: 'john_doe' }),
  schema: env<string>({ key: 'DB_SCHEMA', defaultValue: 'public' }),
  password: env<string>({ key: 'DB_PASSWORD', defaultValue: 'doe_john' }),
}
