#!/usr/bin/env zx

import { $, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type DownContainersProps = BaseProps

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
      await $`docker-compose down`
    } else {
      await spinner('🧨 Downing containers...', async () => {
        await $`docker-compose down`
      })
    }
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to down containers',
      error,
    })
  }
}
