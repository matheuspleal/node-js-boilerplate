import { Presenter } from '@/core/presentation/presenters/presenter'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user.dto'

export interface SignUpPresenterInput {
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
  static toHttp({ user }: SignUpPresenterInput): SignUpPresenterOutput {
    return {
      id: user.id,
      name: user.name,
      birthdate: user.birthdate,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
