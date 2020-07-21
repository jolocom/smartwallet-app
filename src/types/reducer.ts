import { LoaderState } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'
import { InteractionState } from '~/modules/interaction/types'
import { AttrsStateI } from '~/modules/attributes/types'

export interface RootReducerI {
  loader: LoaderState
  account: AccountState
  interaction: InteractionState
  attrs: AttrsStateI<string>
}
