import { CardInfo } from 'react-native-aa2-sdk/js/types'
import { IAusweisRequest } from '~/screens/LoggedIn/eID/types'

export enum AusweisModuleActions {
  setDetails = 'setDetails',
  setScannerKey = 'setScannerKey',
  setReaderState = 'setReaderState',
}

export interface AusweisModuleState {
  details: IAusweisRequest | null
  scannerKey: string | null
  readerState: CardInfo | null
}

export interface SetAusweisDetailsAction {
  type: AusweisModuleActions.setDetails
  payload: IAusweisRequest | null
}

export interface SetAusweisScannerKeyAction {
  type: AusweisModuleActions.setScannerKey
  payload: string | null
}

export interface SetAusweisReaderStateAction {
  type: AusweisModuleActions.setReaderState
  payload: CardInfo | null
}
