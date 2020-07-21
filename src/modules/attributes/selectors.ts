import { RootReducerI } from '~/types/reducer'
import { AttrsState } from './types'

export const getAttributes = (state: RootReducerI): AttrsState<string> =>
  state.attrs
