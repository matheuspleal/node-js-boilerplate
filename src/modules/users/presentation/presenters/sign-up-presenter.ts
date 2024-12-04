import { Presenter } from '@/core/presentation/presenters/presenter'
import { type PersonDTO } from '@/modules/persons/application/use-cases/dtos/person-dto'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user-dto'

export interface SignUpPresenterInput {
  person: PersonDTO
  user: UserDTO
}

export interface SignUpPresenterOutput {
  id: string
  name: string
  birthdate: Date
  email: string
  createdAt: Date
  updatedAt: Date
}

export class SignUpPresenter extends Presenter<
  SignUpPresenterInput,
  SignUpPresenterOutput
> {
  static toHttp({ person, user }: SignUpPresenterInput): SignUpPresenterOutput {
    return {
      id: user.id,
      name: person.name,
      birthdate: person.birthdate,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
