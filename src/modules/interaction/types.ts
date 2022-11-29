import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { FlowType } from 'react-native-jolocom'
import { IAusweisRequest } from '~/screens/Modals/Interaction/eID/types'

import { OfferedCredential } from '~/types/credentials'
import { AusweisDetails, AusweisFlowTypePayload } from './ausweis/types'
import { InteractionDetails } from './ssi/types'

export * from './ausweis/types'
export * from './ssi/types'

/*
 * Holds the mapped Flow state from the SDK's InteractionManager and additional
 * UI related state.
 *
 * @details - mapped flow state. If no active interaction, defaults to { flowType: null }
 * @selectedShareCredentials - mapping of selected {[type]: id} credentials within the interaction
 */
export interface InteractionState {
  ssi: InteractionDetails
  ausweis: AusweisDetails
  deeplinkConfig: DeeplinkConfig
  mdl: MdlConfig | null
}

export interface MdlConfig {
  mdoc: string
}

export interface DeeplinkConfig {
  // NOTE: Shows the user the `ServiceRedirect` screen, which allows the user to
  // get redirected to another application or browser
  redirectUrl: string | null | undefined
  // NOTE: Updates the service's UI that the interaction has finished successfully
  postRedirect: boolean
}

export enum InteractionActionType {
  setInteractionDetails = 'setInteractionDetails',
  resetInteraction = 'resetInteraction',
  selectShareCredential = 'selectShareCredential',
  updateOfferValidation = 'updateOfferValidation',
  setDeeplinkConfig = 'setDeeplinkConfig',
  setDetails = 'setDetails',
  setScannerKey = 'setScannerKey',
  setReaderState = 'setReaderState',
  setFlowType = 'setFlowType',
  setMdoc = 'setMdoc',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface InteractionActions {
  [InteractionActionType.setInteractionDetails]: Omit<
    InteractionDetails,
    'flowType'
  > & { flowType?: FlowType | null }
  [InteractionActionType.resetInteraction]: undefined
  [InteractionActionType.selectShareCredential]: Record<string, string>
  [InteractionActionType.updateOfferValidation]: OfferedCredential[]
  [InteractionActionType.setDeeplinkConfig]: DeeplinkConfig
  [InteractionActionType.setDetails]: IAusweisRequest | null
  [InteractionActionType.setScannerKey]: string | null
  [InteractionActionType.setReaderState]: CardInfo | null
  [InteractionActionType.setFlowType]: AusweisFlowTypePayload
  [InteractionActionType.setMdoc]: string | null
}

// Dependency between action type and its payload following Action type signature
export type InteractionAction<A extends keyof InteractionActions> = {
  type: A
  payload: InteractionActions[A]
}
