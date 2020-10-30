import { LoaderState } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'
import { InteractionState } from '~/modules/interaction/types'
import { AttributesState } from '~/modules/attributes/types'
import { AppStatusState } from '~/modules/appState/types'
import { CredentialsState } from '~/modules/credentials/types'
import { ToastsState } from '~/modules/toasts/types'

export interface RootReducerI {
  loader: LoaderState
  account: AccountState
  interaction: InteractionState
  attrs: AttributesState
  appState: AppStatusState
  credentials: CredentialsState
  toasts: ToastsState
}
