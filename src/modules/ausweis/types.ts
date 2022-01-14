import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { IAusweisRequest } from '~/screens/LoggedIn/eID/types'

export enum AusweisModuleActions {
  setDetails = 'setDetails',
  setScannerKey = 'setScannerKey',
  setReaderState = 'setReaderState',
  setFlowType = 'setFlowType',
}

export enum AusweisFlowType {
  changePin = 'changePin',
  auth = 'auth',
}

export interface AusweisModuleState {
  details: IAusweisRequest | null
  scannerKey: string | null
  readerState: CardInfo | null
  flowType: AusweisFlowType | null
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

export interface SetAusweisFlowTypeAction {
  type: AusweisModuleActions.setFlowType
  payload: AusweisFlowType | null
}
