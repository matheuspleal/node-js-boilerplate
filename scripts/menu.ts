#!/usr/bin/env zx

import { bold, red, blue } from 'kleur/colors'
import { $, echo, question } from 'zx'

import { build } from './build'
import { dockerDeepClean } from './docker-deep-clean'
import { downContainers } from './down-containers'
import { runMigrations } from './run-migrations'
import { startContainers } from './start-containers'
import { startDev } from './start-dev'
import { stopContainers } from './stop-containers'
import { upContainers } from './up-containers'
import { pause } from './utils/pause'

export async function menu() {
  let option
  do {
    option = NaN
    await $`clear`
    echo(
      bold(
        blue(
          '============================  🪄  WIZARD  🪄  =============================\n',
        ),
      ),
    )
    echo('1. 🧱 build images')
    echo('2. 🐳 up containers')
    echo('3. 🚀 start containers')
    echo('4. 🛑 stop containers')
    echo('5. 🐙 start dev')
    echo('6. 🏁 run migrations\n')
    echo(bold(red('******* DANGER ZONE *******')))
    echo(red('** 7. 🧨 down containers **'))
    echo(red('** 8. 💣 docker prune *****'))
    echo(red('** 9. 👋 exit *************'))
    echo(bold(red('***************************')))
    option = Number(await question('\nOption: '))
    await $`clear`
    switch (option) {
      case 1:
        await build({ showHeaders: true })
        break
      case 2:
        await upContainers({ showHeaders: true })
        break
      case 3:
        await startContainers({ showHeaders: true })
        break
      case 4:
        await stopContainers({ showHeaders: true })
        break
      case 5:
        await startDev({ showHeaders: true })
        break
      case 6:
        await runMigrations({ showHeaders: true })
        break
      case 7:
        await downContainers({ showHeaders: true })
        break
      case 8:
        await dockerDeepClean({ showHeaders: true })
        break
      case 9:
        echo('\n👋 I see you later...')
        break
      default:
        echo('\n❌ Invalid option!')
    }
    echo(
      bold(
        '\n================== 🐙 Developed by @matheuspleal 🐙 ====================',
      ),
    )
    await pause('\nPress enter to continue...')
  } while (Number(option) !== 9)
}
