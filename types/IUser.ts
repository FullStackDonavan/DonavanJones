import { ISubscription } from '~/types/ISubscription';

export interface IUser {
  id?: number
  username: string
  firstName?: string
  lastName?: string
  phone?: string
  loginType?: string
  password?: string
  email?: string
  avatarUrl?: string
  subscription?: ISubscription | null
  stripeCustomerId?: string | null
}



