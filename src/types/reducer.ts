import { LoaderStateI } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'

export interface RootReducerI {
  loader: LoaderStateI
  account: AccountState
}
