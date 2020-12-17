import { RootReducerI } from '~/types/reducer'
import { LoaderState } from './types'

export const getLoaderState = (state: RootReducerI): LoaderState => state.loader
