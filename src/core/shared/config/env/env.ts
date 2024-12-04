import { env } from '@/core/shared/config/helpers/env'
import { EnvVariableEnum } from '@/core/shared/config/types/env-variable-enum'

export const server = {
  host: env<string>({ key: 'API_HOST', defaultValue: '0.0.0.0' }),
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

export const token = {
  privateKey: env<string>({
    key: 'JWT_PRIVATE_KEY',
    type: EnvVariableEnum.STRING,
  }),
  publicKey: env<string>({
    key: 'JWT_PUBLIC_KEY',
    type: EnvVariableEnum.STRING,
  }),
}

export const cryptograph = {
  salt: env<number>({
    key: 'HASH_SALT_LENGTH',
    defaultValue: 8,
  }),
}
