import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { LoadingState } from 'src/reducers/registration/'

const initialState: LoadingState = {
  loadingMsg: 'Loading',
}

export const loading = (
  state = Immutable.fromJS(initialState),
  action: AnyAction,
): string => {
  switch (action.type) {
    case 'SET_LOADING_MSG':
      return state.setIn(['loadingMsg'], action.value)
    default:
      return state
  }
}
