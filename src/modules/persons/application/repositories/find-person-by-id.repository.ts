import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'

export interface FindPersonByIdRepository {
  findById(id: string): Promise<PersonEntity | null>
}
