import { IAusweisRequest } from '~/screens/LoggedIn/eID/types'

export enum AusweisModuleActions {
  setDetails = 'setDetails',
  setScannerKey = 'setScannerKey',
}

export interface AusweisModuleState {
  details: IAusweisRequest | null
  scannerKey: string | null
}

export interface SetAusweisDetailsAction {
  type: AusweisModuleActions.setDetails
  payload: IAusweisRequest | null
}

export interface SetAusweisScannerKeyAction {
  type: AusweisModuleActions.setScannerKey
  payload: string | null
}
