import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { AusweisFlow, IAusweisRequest } from '~/screens/LoggedIn/eID/types'

export type AusweisFlowTypePayload =
  | AusweisFlow.auth
  | AusweisFlow.changePin
  | null

export interface AusweisDetails {
  details: IAusweisRequest | null
  scannerKey: string | null
  readerState: CardInfo | null
  flowType: AusweisFlowTypePayload
}
