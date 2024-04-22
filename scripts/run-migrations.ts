#!/usr/bin/env zx

import { $, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type RunMigrationsProps = BaseProps

async function execute() {
  await $`npx prisma migrate dev`
}

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
      await execute()
      return
    }
    await spinner('🏁 Running migrations...', async () => {
      await execute()
    })
  } catch (error: any) {
    if (!args.includes('--logs')) {
      errorMessage({
        message: 'Error when trying to run migrations',
        error,
      })
    }
  }
}
