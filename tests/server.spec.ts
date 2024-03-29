import { port } from '@/server'

it('should be able port equals 3333', () => {
  expect(port).toEqual(3333)
})
