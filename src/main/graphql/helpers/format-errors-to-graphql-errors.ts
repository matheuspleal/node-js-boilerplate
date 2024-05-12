import { type GraphQLError } from 'graphql'

import { type ValidationComposite } from '@/core/presentation/validators/errors/validation-composite-error'
import { buildGraphQLError } from '@/main/graphql/helpers/build-graphql-error'

export function formatErrorsToGraphQLErrors(
  errors: ValidationComposite.FormattedError[],
  statusCode: number,
): readonly GraphQLError[] {
  return errors.flatMap((error) =>
    error.reasons.map((reason) =>
      buildGraphQLError(reason.message, statusCode),
    ),
  )
}
