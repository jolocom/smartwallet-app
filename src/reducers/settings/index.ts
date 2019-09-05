import { AnyAction } from 'redux'

export interface SettingsState {
  readonly locale: string
  readonly seedPhraseSaved: boolean
  readonly shardsCreated: boolean
}

const initialState: SettingsState = {
  locale: '',
  seedPhraseSaved: false,
  shardsCreated: false,
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
    case 'SET_SHARDS_CREATED':
      return {
        ...state,
        seedPhraseSaved: true,
      }
    default:
      return state
  }
}
