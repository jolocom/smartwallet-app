import { AnyAction } from 'redux'
import { combineReducers } from 'redux'
import { loading } from 'src/reducers/registration/loading'
import { seedPhrase } from 'src/reducers/registration/seedPhrase'

export interface RegistrationState {
  readonly did: string
  readonly seedPhrase: string
  readonly loadingMsg: string
}

export const registrationReducer = combineReducers({
  loading,
  seedPhrase
})
