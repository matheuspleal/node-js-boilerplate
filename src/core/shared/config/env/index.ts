import { env } from '@/core/shared/config/helpers/env.helper'
import { EnvVariableEnum } from '@/core/shared/config/types/env-variable.enum'

export const environment = env<
  'development' | 'test' | 'staging' | 'production'
>({
  key: 'NODE_ENV',
  defaultValue: 'development',
}) as 'development' | 'test' | 'staging' | 'production'

export const server = {
  host: env<string>({ key: 'API_HOST', defaultValue: '0.0.0.0' }),
  port: env<number>({ key: 'API_PORT', defaultValue: 3333 }),
  shutdownTimeoutInMs: env<number>({
    key: 'SERVER_SHUTDOWN_TIMEOUT_IN_MS',
    defaultValue: 10_000,
  }),
} as const

export const api = {
  currentVersion: env<string>({ key: 'API_VERSION', defaultValue: 'v1' }),
} as const

export const database = {
  host: env<string>({ key: 'DB_HOST', defaultValue: 'localhost' }),
  port: env<number>({ key: 'DB_PORT', defaultValue: 5432 }),
  name: env<string>({ key: 'DB_NAME', defaultValue: 'node_js_skeleton' }),
  user: env<string>({ key: 'DB_USER', defaultValue: 'john_doe' }),
  password: env<string>({ key: 'DB_PASSWORD', defaultValue: 'doe_john' }),
  schema: env<string>({ key: 'DB_SCHEMA', defaultValue: 'public' }),
  pool: env<number>({ key: 'DB_POOL', defaultValue: 20 }),
  idleTimeout: env<number>({
    key: 'DB_IDLE_TIMEOUT_IN_MS',
    defaultValue: 30000,
  }),
  connectionTimeout: env<number>({
    key: 'DB_CONNECTION_TIMEOUT_IN_MS',
    defaultValue: 2000,
  }),
} as const

export const token = {
  privateKey: env<string>({
    key: 'JWT_PRIVATE_KEY',
    type: EnvVariableEnum.STRING,
  }),
  publicKey: env<string>({
    key: 'JWT_PUBLIC_KEY',
    type: EnvVariableEnum.STRING,
  }),
} as const

export const cryptograph = {
  salt: env<number>({
    key: 'HASH_SALT_LENGTH',
    defaultValue: 8,
  }),
} as const
