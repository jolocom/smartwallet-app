import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { AusweisFlow, IAusweisRequest } from '~/screens/LoggedIn/eID/types'

export enum AusweisActionType {
  setDetails = 'setDetails',
  setScannerKey = 'setScannerKey',
  setReaderState = 'setReaderState',
  setFlowType = 'setFlowType',
}

type AusweisFlowTypePayload = AusweisFlow.auth | AusweisFlow.changePin | null

export interface AusweisModuleState {
  details: IAusweisRequest | null
  scannerKey: string | null
  readerState: CardInfo | null
  flowType: AusweisFlowTypePayload
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface AusweisActions {
  [AusweisActionType.setDetails]: IAusweisRequest | null
  [AusweisActionType.setScannerKey]: string | null
  [AusweisActionType.setReaderState]: CardInfo | null
  [AusweisActionType.setFlowType]: AusweisFlowTypePayload
}

// Dependency between action type and its payload following Action type signature
export type AusweisAction<A extends keyof AusweisActions> = {
  type: A
  payload: AusweisActions[A]
}
