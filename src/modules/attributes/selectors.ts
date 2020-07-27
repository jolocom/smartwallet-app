import { RootReducerI } from '~/types/reducer'
import { AttrsState, AttributeI } from './types'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all
