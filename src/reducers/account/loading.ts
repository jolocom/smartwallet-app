import { AnyAction } from 'redux'
import { LoadingState } from 'src/reducers/account/'

const initialState: LoadingState = false

export const loading = (
  state = initialState,
  action: AnyAction,
): LoadingState => {
  switch (action.type) {
    case 'SET_LOADING':
      return action.value
    default:
      return state
  }
}
