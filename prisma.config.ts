import 'dotenv/config'

import { defineConfig, env } from 'prisma/config'

const dbUser = env('DB_USER')
const dbPassword = env('DB_PASSWORD')
const dbHost = env('DB_HOST')
const dbPort = env('DB_PORT')
const dbName = env('DB_NAME')
const dbSchema = env('DB_SCHEMA')
const databaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchema}`

export default defineConfig({
  schema: 'prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
})
