import { combineReducers } from 'redux'
import { loading } from 'src/reducers/registration/loading'

export interface LoadingState {
  readonly loadingStage: number
  readonly loadingStages: string[]
}

export interface RegistrationState {
  readonly loading: LoadingState
  readonly loadingStages: string[]
}

export const registrationReducer = combineReducers({
  loading
})
