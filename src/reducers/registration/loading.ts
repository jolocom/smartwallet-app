import { AnyAction } from 'redux'
import { LoadingState } from 'src/reducers/registration/'

const initialState: LoadingState = {
  loadingMsg: 'Loading',
  isRegistering: false,
}

export const loading = (
  state = initialState,
  action: AnyAction,
): LoadingState => {
  switch (action.type) {
    case 'SET_IS_REGISTERING':
      return {
        ...state,
        isRegistering: action.value,
      }
    case 'SET_LOADING_MSG':
      return {
        ...state,
        loadingMsg: action.value,
      }
    default:
      return state
  }
}
