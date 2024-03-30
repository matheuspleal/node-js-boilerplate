import { faker } from '@faker-js/faker'

import { ValidatorFieldProps } from '@/core/presentation/validators/validator'

import { CollectionStubProps } from '#/@types/collection-stub-props-contract'
import { FieldStubProps } from '#/core/presentation/@mocks/field-stub-props'

export function makeFakeFieldStub({
  withValue,
}: FieldStubProps): ValidatorFieldProps {
  return {
    name: faker.word.noun({ strategy: 'shortest' }),
    value: withValue
      ? faker.word.noun({ strategy: 'shortest' })
      : faker.helpers.arrayElement([null, undefined]),
  }
}

export function makeFakeCollectionFieldStub({
  length,
  withValue,
}: CollectionStubProps & FieldStubProps): ValidatorFieldProps[] {
  return Array.from({ length }).map(() => makeFakeFieldStub({ withValue }))
}
