import { parseJSONSafe } from '@/main/helpers/parse-json-safe.helper'

describe('parseJSONSafe', () => {
  it('should be able to parse a valid JSON string into its object representation', () => {
    const parsed = parseJSONSafe<{ foo: string }>('{"foo":"bar"}')

    expect(parsed).toEqual({ foo: 'bar' })
  })

  it('should be able to parse a valid JSON array string', () => {
    const parsed = parseJSONSafe<number[]>('[1,2,3]')

    expect(parsed).toEqual([1, 2, 3])
  })

  it('should be able to return the original string when input is not valid JSON', () => {
    const parsed = parseJSONSafe('not-json')

    expect(parsed).toBe('not-json')
  })

  it('should be able to return the original string when input is empty', () => {
    const parsed = parseJSONSafe('')

    expect(parsed).toBe('')
  })
})
