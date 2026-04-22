import { Specification } from '@/core/domain/specifications/specification'
import { MINIMUM_AGE } from '@/modules/users/domain/constants/minimum-age.const'
import { type BirthdateVO } from '@/modules/users/domain/value-objects/birthdate.vo'

export class MinimumAgeSpecification extends Specification<BirthdateVO> {
  isSatisfiedBy(birthdate: BirthdateVO): boolean {
    return birthdate.getCurrentAgeInYears() >= MINIMUM_AGE
  }
}
