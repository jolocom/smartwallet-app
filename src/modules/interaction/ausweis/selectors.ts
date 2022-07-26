import { RootReducerI } from '~/types/reducer'

export const getAusweisInteractionDetails = (state: RootReducerI) =>
  state.interaction.ausweis.details

export const getAusweisScannerKey = (state: RootReducerI) =>
  state.interaction.ausweis.scannerKey

export const getAusweisReaderState = (state: RootReducerI) =>
  state.interaction.ausweis.readerState

export const getIsAusweisInteractionProcessed = (state: RootReducerI) =>
  !!state.interaction.ausweis.details

export const getAusweisFlowType = (state: RootReducerI) =>
  state.interaction.ausweis.flowType
