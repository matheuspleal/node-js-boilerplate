#!/usr/bin/env zx

import { $, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
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
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to up containers',
      error,
    })
  }
}
