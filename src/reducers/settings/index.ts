import { AnyAction } from 'redux'

export interface SettingsState {
  readonly locale: string
  readonly seedPhraseSaved: boolean
}

const initialState: SettingsState = {
  locale: '',
  seedPhraseSaved: false,
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
    case 'SET_SEED_PHRASE_SAVED':
      return {
        ...state,
        seedPhraseSaved: true,
      }
    default:
      return state
  }
}
