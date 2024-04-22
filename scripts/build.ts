#!/usr/bin/env zx

import { $, echo, spinner } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type BuildProps = BaseProps

async function execute() {
  await $`docker-compose build`
}

export async function build(props?: BuildProps) {
  const args = getArgsFromCLI()
  if (props?.showHeaders) {
    await header({
      title:
        '========================== 🧱 BUILD-IMAGES 🧱 ===========================',
    })
  }
  try {
    if (args.includes('--logs')) {
      await execute()
      return
    }
    await spinner('🧱 Building images...', async () => {
      await execute()
    })
    echo('🧱 Build executed successfully!')
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to build images',
      error,
    })
  }
}
