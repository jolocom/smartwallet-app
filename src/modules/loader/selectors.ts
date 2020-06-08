import { RootReducerI } from '~/types/reducer'
import { LoaderStateI } from './types'

export const getLoaderState = (state: RootReducerI): LoaderStateI =>
  state.loader
