import { combineReducers } from 'redux'
import { settingsReducer, SettingsState } from 'src/reducers/settings/'
import { accountReducer, AccountState } from 'src/reducers/account/'
import {
  registrationReducer,
  RegistrationState,
} from 'src/reducers/registration/'
import { documentsReducer, DocumentsState } from './documents'

export const rootReducer = combineReducers({
  settings: settingsReducer,
  account: accountReducer,
  registration: registrationReducer,
  documents: documentsReducer,
})

export interface RootState {
  readonly settings: SettingsState
  readonly account: AccountState
  readonly registration: RegistrationState
  readonly documents: DocumentsState
}
