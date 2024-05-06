#!/usr/bin/env zx

import { $, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type DownContainersProps = BaseProps

async function execute() {
  await $`docker-compose down`
}

export async function downContainers(props?: DownContainersProps) {
  const args = getArgsFromCLI()
  if (props?.showHeaders) {
    await header({
      title:
        '========================== 🐳 DOWN-CONTAINERS 🐳 ==========================',
    })
  }
  try {
    if (args.includes('--logs')) {
      await execute()
      return
    }
    await spinner('🧨 Downing containers...', async () => {
      await execute()
    })
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to down containers',
      error,
    })
  }
}
