import { RootReducerI } from '~/types/reducer'

export * from './ssi/selectors'

export const getRedirectUrl = (state: RootReducerI) =>
  state.interaction.redirectUrl
