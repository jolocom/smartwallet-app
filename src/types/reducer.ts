import { LoaderState } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'
import { InteractionStateI } from '~/modules/interaction/types'
import { AttributesState } from '~/modules/attributes/types'
import { AppStatusState } from '~/modules/appState/types'
import { CredentialsState } from '~/modules/credentials/types'

export interface RootReducerI {
  loader: LoaderState
  account: AccountState
  interaction: InteractionStateI
  attrs: AttributesState
  appState: AppStatusState
  credentials: CredentialsState
}
