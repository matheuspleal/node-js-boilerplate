#!/usr/bin/env zx

import { bold } from 'kleur/colors'
import { $, echo, spinner } from 'zx'

import { BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type StartContainersProps = BaseProps

export async function startContainers(props?: StartContainersProps) {
  const args = getArgsFromCLI()
  if (props?.showHeaders) {
    await header({
      title:
        '======================== 🟢 START CONTAINERS 🟢 =========================',
    })
  }
  try {
    if (args.includes('--logs')) {
      await $`docker-compose start`
    } else {
      await spinner('🟢 Starting containers...', async () => {
        await $`docker-compose start`
      })
    }
    echo(bold('\nContainers status:'))
    await $`docker ps`
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to start containers',
      error,
    })
  }
}
