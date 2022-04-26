import { RootReducerI } from '~/types/reducer'

export * from './ssi/selectors'
export * from './ausweis/selectors'

export const getRedirectUrl = (state: RootReducerI) =>
  state.interaction.redirectUrl

export const getRefreshUrl = (state: RootReducerI) =>
  state.interaction.refreshUrl
