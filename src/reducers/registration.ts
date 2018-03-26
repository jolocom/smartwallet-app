import {AnyAction} from 'redux'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
  registrationProgress: {
    loading: false,
    loadingMsg: ''
  }
})

export const registration = (state = initialState, action: AnyAction): string => {
  switch (action.type) {
    case 'SET_LOADING_MSG':
      return state.setIn(['registrationProgress', 'loadingMsg'], action.loadingMsg)
    case 'START_LOADING':
      return state.setIn(['registrationProgress', 'loading'], action.loading)
    case 'FINISH_LOADING':
      return state.setIn(['registrationProgress', 'loading'], action.loading)
    default:
      return state
  }
}
