import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { SettingsState } from 'src/reducers/generic/'

const initialState: SettingsState = {
  locale: '',
}

export const settings = (
  state = Immutable.fromJS(initialState),
  action: AnyAction,
): string => {
  switch (action.type) {
    case 'LOAD_SETTINGS':
      return Immutable.fromJS(action.value)
    case 'SET_LOCALE':
      return state.setIn(['locale'], action.value)
    default:
      return state
  }
}
