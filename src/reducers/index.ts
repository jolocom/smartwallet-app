import { combineReducers } from 'redux'
import { settingsReducer, SettingsState } from 'src/reducers/settings/'
import { accountReducer, AccountState } from 'src/reducers/account/'
import {
  registrationReducer,
  RegistrationState,
} from 'src/reducers/registration/'
import { ssoReducer, SsoState } from 'src/reducers/sso/'
import { documentsReducer, DocumentsState } from './documents'
import { recoveryReducer, RecoveryState } from './recovery'

export const rootReducer = combineReducers({
  settings: settingsReducer,
  account: accountReducer,
  registration: registrationReducer,
  sso: ssoReducer,
  documents: documentsReducer,
  recovery: recoveryReducer,
})

export interface RootState {
  readonly settings: SettingsState
  readonly account: AccountState
  readonly registration: RegistrationState
  readonly sso: SsoState
  readonly documents: DocumentsState
  readonly recovery: RecoveryState
}
