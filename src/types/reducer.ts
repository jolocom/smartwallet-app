import { LoaderState } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'
import { InteractionState } from '~/modules/interaction/types'

export interface RootReducerI {
  loader: LoaderState
  account: AccountState
  interaction: InteractionState
}
