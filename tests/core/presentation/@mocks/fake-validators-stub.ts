import { faker } from '@faker-js/faker'

import { RequiredFieldRule } from '@/core/presentation/validators/rules/required-field-rule'

import { CollectionStubProps } from '#/@types/collection-stub-props-contract'
import { makeFakeCollectionFieldStub } from '#/core/presentation/@mocks/fake-field-stub'
import { FieldStubProps } from '#/core/presentation/@mocks/field-stub-props'

export function makeFakeValidatorStub({
  length,
  withValue,
}: CollectionStubProps & FieldStubProps) {
  const RandomValidator = faker.helpers.arrayElement([RequiredFieldRule])
  return new RandomValidator(makeFakeCollectionFieldStub({ length, withValue }))
}

export function makeFakeCollectionValidatorStub({
  length,
  withValue,
}: CollectionStubProps & FieldStubProps) {
  return Array.from({ length }).map(() =>
    makeFakeValidatorStub({ length, withValue }),
  )
}
