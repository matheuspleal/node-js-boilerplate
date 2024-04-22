#!/usr/bin/env zx

import { $ } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { header } from './utils/header'

type StartDevProps = BaseProps

async function execute() {
  await $`docker-compose up database -d`
  await $`npm run start:dev`
}

export async function startDev(props?: StartDevProps) {
  if (props?.showHeaders) {
    await header({
      title:
        '======================== 🐙 START DEV 🐙 =========================',
    })
  }
  try {
    await execute()
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to start in development mode',
      error,
    })
  }
}
