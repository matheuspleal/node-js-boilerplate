#!/usr/bin/env zx

const ARGS_INDEX = 2
const listOfArgs = ['--logs'] as const

export type Args = (typeof listOfArgs)[number]

export function getArgsFromCLI(): Args[] {
  const allArgs = process.argv.slice(ARGS_INDEX) as Args[]
  return allArgs.filter((arg: Args) => listOfArgs.includes(arg))
}
