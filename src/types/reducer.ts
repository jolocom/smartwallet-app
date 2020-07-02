import { LoaderStateI } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'
import { InteractionsState } from '~/modules/interactions/types'

export interface RootReducerI {
  loader: LoaderStateI
  account: AccountState
  interactions: InteractionsState
}
