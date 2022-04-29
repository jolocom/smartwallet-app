import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { IAusweisRequest } from '~/screens/LoggedIn/eID/types'

export enum AusweisActionType {
  setDetails = 'setDetails',
  setScannerKey = 'setScannerKey',
  setReaderState = 'setReaderState',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface AusweisActions {
  [AusweisActionType.setDetails]: IAusweisRequest | null
  [AusweisActionType.setScannerKey]: string | null
  [AusweisActionType.setReaderState]: CardInfo | null
}

// Dependency between action type and its payload following Action type signature
export type AusweisAction<A extends keyof AusweisActions> = {
  type: A
  payload: AusweisActions[A]
}

export interface AusweisModuleState {
  details: IAusweisRequest | null
  scannerKey: string | null
  readerState: CardInfo | null
}
