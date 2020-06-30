import { LoaderStateI } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'
import { InteractionState } from '~/modules/interaction/types'

export interface RootReducerI {
  loader: LoaderStateI
  account: AccountState
  interaction: InteractionState
}
