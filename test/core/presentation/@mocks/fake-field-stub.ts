import { faker } from '@faker-js/faker'

import { type Validator } from '@/core/presentation/validators/contracts/validator-rule'

import { type FieldStubProps } from '#/core/presentation/@mocks/field-stub-props'

export function makeFakeFieldStub({
  withValue,
}: FieldStubProps): Validator.Field {
  return {
    name: faker.word.noun({ strategy: 'shortest' }),
    value: withValue
      ? faker.word.noun({ strategy: 'shortest' })
      : faker.helpers.arrayElement([null, undefined]),
  }
}
