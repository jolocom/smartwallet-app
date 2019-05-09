import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { LoadingState } from 'src/reducers/registration/'

const initialState : LoadingState = {
  loadingStage: 0,
  loadingStages: [],
}

export const loading = (
  state = Immutable.fromJS(initialState),
  action: AnyAction,
): string => {
  switch (action.type) {
    case 'SET_NEXT_LOADING_STAGE':
      return state.setIn(['loadingStage'], state.getIn(['loadingStage']) + 1)
    case 'SET_LOADING_STAGES':
      return state.setIn(['loadingStages'], action.value)
    default:
      return state
  }
}
