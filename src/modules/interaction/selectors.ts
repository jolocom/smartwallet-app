import { RootReducerI } from '~/types/reducer'

export * from './ssi/selectors'
export * from './ausweis/selectors'

export const getDeeplinkConfig = (state: RootReducerI) =>
  state.interaction.deeplinkConfig
