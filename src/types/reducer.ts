import { LoaderState } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'
import { InteractionState } from '~/modules/interaction/types'
import { AppStatusState } from '~/modules/appState/types'

export interface RootReducerI {
  loader: LoaderState
  account: AccountState
  interaction: InteractionState
  appState: AppStatusState
}
