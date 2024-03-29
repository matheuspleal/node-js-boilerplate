#!/usr/bin/env zx

import { bold, red } from 'kleur/colors'
import { echo } from 'zx'

export type ErrorMessageProps = {
  message: string
  error: any
}

export function errorMessage({ message, error }: ErrorMessageProps) {
  echo(bold(`${red(message)}:\n\n${error}`))
}
