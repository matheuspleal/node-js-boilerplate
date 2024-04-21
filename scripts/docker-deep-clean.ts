#!/usr/bin/env zx

import { bold, green, red } from 'kleur/colors'
import { $, question } from 'zx'

import { type BaseProps } from './utils/base-props'
import { errorMessage } from './utils/error-message'
import { header } from './utils/header'

type DockerDeepCleanProps = BaseProps

export async function dockerDeepClean(props?: DockerDeepCleanProps) {
  if (props?.showHeaders) {
    await header({
      title:
        '======================= 🧼 DOCKER DEEP CLEAN 🧼 =========================',
    })
  }
  try {
    const option = await question(
      `${bold(
        red('🚨 Attention 🚨'),
      )}\n\nThis action is irreversible! Are you sure you want to deep clean Docker?\n(type ${bold(
        red('yes'),
      )} to confirm | type ${bold(green('no'))} to cancel): `,
    )
    if (option.toLowerCase() === 'yes') {
      await $`docker rmi -f $(docker images -aq) && docker system prune --all --volumes --force && docker rm -vf $(docker ps -aq)`
    }
  } catch (error: any) {
    errorMessage({
      message: 'Error when trying to execute Docker deep clean',
      error,
    })
  }
}
