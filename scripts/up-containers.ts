#!/usr/bin/env zx

import { $, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type UpContainersProps = BaseProps

async function execute() {
  await $`docker-compose up -d`
}

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
      await execute()
      return
    }
    await spinner('🧱 Starting containers...', async () => {
      await execute()
    })
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to up containers',
      error,
    })
  }
}
