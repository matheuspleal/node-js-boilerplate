#!/usr/bin/env zx

import { $, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type RunMigrationsProps = BaseProps

export async function runMigrations(props?: RunMigrationsProps) {
  const args = getArgsFromCLI()
  if (props?.showHeaders) {
    await header({
      title:
        '========================= 🏁 RUN-MIGRATIONS 🏁 ==========================',
    })
  }
  try {
    if (args.includes('--logs')) {
      await $`npx prisma migrate dev`
    } else {
      await spinner('🏁 Running migrations...', async () => {
        await $`npx prisma migrate dev`
      })
    }
  } catch (error: any) {
    if (!args.includes('--logs')) {
      errorMessage({
        message: 'Error when trying to run migrations',
        error,
      })
    }
  }
}
