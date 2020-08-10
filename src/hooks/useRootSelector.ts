import { useSelector } from 'react-redux'
import { RootReducerI } from '~/types/reducer'

export const useRootSelector = <T>(selector: (state: RootReducerI) => T) => {
  const interactionDetails = useSelector<RootReducerI, T>(selector)
  return interactionDetails
}
