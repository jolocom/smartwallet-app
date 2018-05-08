import { combineReducers } from 'redux'
import { loading } from 'src/reducers/registration/loading'
import { Map } from 'immutable'

// TODO Tighter policy / practices when using immutable with redux.
export interface RegistrationState {
  readonly loading: Map<string, string>
}

export const registrationReducer = combineReducers({
  loading
})
