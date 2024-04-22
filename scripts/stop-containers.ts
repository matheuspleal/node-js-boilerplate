#!/usr/bin/env zx

import { $, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type StopContainersProps = BaseProps

async function execute() {
  await $`docker-compose stop`
}

export async function stopContainers(props?: StopContainersProps) {
  const args = getArgsFromCLI()
  if (props?.showHeaders) {
    await header({
      title:
        '======================== 🛑 STOP CONTAINERS 🛑 ==========================',
    })
  }
  try {
    if (args.includes('--logs')) {
      await execute()
      return
    }
    await spinner('🛑 Stopping containers...', async () => {
      await execute()
    })
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to stop containers',
      error,
    })
  }
}
