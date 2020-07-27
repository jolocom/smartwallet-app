import { RootReducerI } from '~/types/reducer'

export const getIsPopup = (state: RootReducerI): boolean => {
  return state.appState.isPopup
}
