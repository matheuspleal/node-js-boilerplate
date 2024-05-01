import { faker } from '@faker-js/faker'

import { IsValidUUIDRule } from '@/core/presentation/validators/rules/is-valid-uuid-rule'
import { RequiredRule } from '@/core/presentation/validators/rules/required-rule'

import { type CollectionStubProps } from '#/@types/collection-stub-props-contract'
import { makeFakeCollectionFieldStub } from '#/core/presentation/@mocks/fake-field-stub'
import { type FieldStubProps } from '#/core/presentation/@mocks/field-stub-props'

export function makeFakeValidatorStub({
  length,
  withValue,
}: CollectionStubProps & FieldStubProps) {
  const RandomValidator = faker.helpers.arrayElement([
    RequiredRule,
    IsValidUUIDRule,
  ])
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
