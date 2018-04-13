import {AnyAction} from 'redux'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
  loadingMsg: 'Loading'
})

export const loading = (state = initialState, action: AnyAction): string => {
  switch (action.type) {
    case 'SET_LOADING_MSG':
      console.log('SET LOADING MSG')
      console.log(action.value)
      return state.setIn(['loadingMsg'], action.value)
    default:
      return state
  }
}
