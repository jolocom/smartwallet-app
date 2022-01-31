import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { AusweisFlow, IAusweisRequest } from '~/screens/LoggedIn/eID/types'

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

type AusweisFlowTypePayload = AusweisFlow.auth | AusweisFlow.changePin | null

export interface AusweisModuleState {
  details: IAusweisRequest | null
  scannerKey: string | null
  readerState: CardInfo | null
  flowType: AusweisFlowTypePayload
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
  payload: AusweisFlowTypePayload
}
