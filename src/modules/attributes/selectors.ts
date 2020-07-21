import { RootReducerI } from '~/types/reducer'
import { AttrsStateI } from './types'

export const getAttributes = (state: RootReducerI): AttrsStateI<string> =>
  state.attrs
