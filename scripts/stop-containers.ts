#!/usr/bin/env zx

import { bold } from 'kleur/colors'
import { $, echo, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type StopContainersProps = BaseProps

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
      await $`docker-compose stop`
    } else {
      await spinner('🟢 Stopping containers...', async () => {
        await $`docker-compose stop`
      })
    }
    echo(bold('\nContainers status:'))
    await $`docker ps`
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to stop containers',
      error,
    })
  }
}
