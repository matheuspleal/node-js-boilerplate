import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getCurrentDirname } from '@/main/helpers/get-current-dirname.helper'

describe('getCurrentDirname', () => {
  it('should be able to return the directory of the helper file', () => {
    const expected = dirname(fileURLToPath(import.meta.url))

    expect(getCurrentDirname()).toBe(expected)
  })

  it('should be able to return an absolute path', () => {
    const result = getCurrentDirname()

    expect(result.startsWith('/')).toBe(true)
  })
})
