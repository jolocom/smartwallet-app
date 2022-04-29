import {
  ThunkDispatch as OriginalThunkDispatch,
  ThunkAction as OriginalThunkAction,
} from 'redux-thunk'

import { LoaderState } from '~/modules/loader/types'
import { AccountState } from '~/modules/account/types'
import { InteractionState } from '~/modules/interaction/types'
import { AttributesState } from '~/modules/attributes/types'
import { AppStatusState } from '~/modules/appState/types'
import { CredentialsState } from '~/modules/credentials/types'
import { ToastsState } from '~/modules/toasts/types'
import { AnyAction } from 'redux'
import { MdlState } from '~/modules/mdl/types'
import { AusweisModuleState } from '~/modules/ausweis/types'

export interface RootReducerI {
  loader: LoaderState
  account: AccountState
  interaction: InteractionState
  attrs: AttributesState
  appState: AppStatusState
  credentials: CredentialsState
  toasts: ToastsState
  mdl: MdlState
  ausweis: AusweisModuleState
}

export type ThunkDispatch = OriginalThunkDispatch<RootReducerI, null, AnyAction>

export type ThunkAction<R = AnyAction | Promise<AnyAction | void>> =
  OriginalThunkAction<R, RootReducerI, null, AnyAction>
