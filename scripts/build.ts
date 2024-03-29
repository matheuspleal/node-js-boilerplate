#!/usr/bin/env zx

import { $, echo, spinner } from 'zx'

import { BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { getArgsFromCLI } from './utils/get-args-from-cli'
import { header } from './utils/header'

type BuildProps = BaseProps

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
      await $`docker-compose build`
      return
    }
    await spinner('🧱 Building images...', async () => {
      await $`docker-compose build`
    })
    echo('🧱 Build executed successfully!')
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to build images',
      error,
    })
  }
}
