import {AnyAction} from 'redux'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
  progress: {
    loading: false,
    loadingMsg: 'Loading'
  }
})

export const registration = (state = initialState, action: AnyAction): string => {
  switch (action.type) {
    case 'SET_LOADING_MSG':
      console.log('SET LOADING MSG')
      return state.setIn(['progress', 'loadingMsg'], action.value)
    case 'START_LOADING':
      return state.setIn(['progress', 'loading'], action.value)
    case 'FINISH_LOADING':
      return state.setIn(['progress', 'loading'], action.value)
    default:
      return state
  }
}
