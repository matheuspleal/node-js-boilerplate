#!/usr/bin/env zx

import { bold } from 'kleur/colors'
import { $, echo, spinner } from 'zx'

import { runMigrations } from './run-migrations'
import { BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type UpContainersProps = BaseProps

export async function upContainers(props?: UpContainersProps) {
  const args = getArgsFromCLI()
  if (props?.showHeaders) {
    await header({
      title:
        '========================== 🐳 UP-CONTAINERS 🐳 ==========================',
    })
  }
  try {
    if (args.includes('--logs')) {
      await $`docker-compose up -d`
    } else {
      await spinner('🧱 Starting containers...', async () => {
        await $`docker-compose up -d`
      })
    }
    echo(bold('\nContainers status:'))
    await $`docker ps -a`
    echo('\n')
    await runMigrations()
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to up containers',
      error,
    })
  }
}
