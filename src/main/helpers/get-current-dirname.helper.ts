import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getCurrentDirname() {
  const filename = fileURLToPath(import.meta.url)
  return dirname(filename)
}
