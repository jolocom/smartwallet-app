import { AnyAction } from 'redux'

export interface SettingsState {
  readonly locale: string
}

const initialState: SettingsState = {
  locale: '',
}

export const settingsReducer = (
  state = initialState,
  action: AnyAction,
): SettingsState => {
  switch (action.type) {
    case 'LOAD_SETTINGS':
      return action.value
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.value,
      }
    default:
      return state
  }
}
