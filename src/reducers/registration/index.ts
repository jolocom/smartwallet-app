import { combineReducers } from 'redux'
import { loading } from 'src/reducers/registration/loading'

export interface RegistrationState {
  readonly did: string
  readonly loading: {
    loadingMsg: string,
    getIn: any
  }
}

export const registrationReducer = combineReducers({
  loading
})
