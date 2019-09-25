import { AnyAction } from 'redux'

export interface SsoState {
}

export const initialState: SsoState = {
}

export const ssoReducer = (
  state = initialState,
  action: AnyAction,
): SsoState => {
  switch (action.type) {
    case 'CLEAR_INTERACTION_REQUEST':
      return initialState
    default:
      return state
  }
}
