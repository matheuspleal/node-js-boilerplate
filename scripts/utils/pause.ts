#!/usr/bin/env zx

import { question } from 'zx'

export async function pause(message: string) {
  await question(message)
}
