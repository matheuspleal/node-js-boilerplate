#!/usr/bin/env zx

import { $, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type StartContainersProps = BaseProps

async function execute() {
  await $`docker-compose start`
}

export async function startContainers(props?: StartContainersProps) {
  const args = getArgsFromCLI()
  if (props?.showHeaders) {
    await header({
      title:
        '======================== 🚀 START CONTAINERS 🚀 =========================',
    })
  }
  try {
    if (args.includes('--logs')) {
      await execute()
      return
    }
    await spinner('🚀 Starting containers...', async () => {
      await execute()
    })
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to start containers',
      error,
    })
  }
}
