import { AnyAction } from 'redux'
import { combineReducers } from 'redux'
import { seedPhrase } from 'src/reducers/registration/seedPhrase'

export interface RegistrationState {
  seedPhrase: string;
}

export const registrationReducer = combineReducers({
  seedPhrase
})