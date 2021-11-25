import { RootReducerI } from '~/types/reducer'

export const getAusweisInteractionDetails = (state: RootReducerI) =>
  state.ausweis.details

export const getAusweisScannerKey = (state: RootReducerI) =>
  state.ausweis.scannerKey

export const getIsAusweisInteractionProcessed = (state: RootReducerI) =>
  !!state.ausweis.details