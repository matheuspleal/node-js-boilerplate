#!/usr/bin/env zx

import { blue, bold } from 'kleur/colors'
import { $, echo } from 'zx'

export interface HeaderProps {
  title: string
}

export async function header({ title }: HeaderProps) {
  await $`clear`
  echo(bold(blue(`${title}\n`)))
}
