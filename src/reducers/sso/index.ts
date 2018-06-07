import { AnyAction } from 'redux'

export interface SsoState {
}

const initialState: SsoState = {

}

export const ssoReducer = (state = initialState, action: AnyAction) => {
  switch(action.type) {
    default:
      return state
  }
}