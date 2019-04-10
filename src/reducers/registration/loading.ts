import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { LoadingState } from 'src/reducers/registration/'

const initialState : LoadingState = {
  loadingStage: 0
}

export const loading = (state = Immutable.fromJS(initialState), action: AnyAction): string => {
  switch (action.type) {
    case 'SET_NEXT_LOADING_STAGE':
      return state.setIn(['loadingStage'], state.getIn(['loadingStage']) + 1)
    default:
      return state
  }
}
