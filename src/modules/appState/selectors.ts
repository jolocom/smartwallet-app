import { RootReducerI } from '~/types/reducer'
import { AppStateStatus } from 'react-native'

export const getIsPopup = (state: RootReducerI): boolean => {
  return state.appState.isPopup
}
