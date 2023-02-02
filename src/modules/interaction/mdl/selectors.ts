import { RootReducerI } from '~/types/reducer'

export const getMdoc = (state: RootReducerI) => state.interaction.mdl?.mdoc

export const getIsPersonalizingMdl = (state: RootReducerI) =>
  state.interaction.mdl?.isPersonalizingMdl
