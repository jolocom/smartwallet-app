import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { AttrsState } from '../attributes/types'
import { SelectableAttrI } from '~/components/AttributesWidget'

export enum InteractionActions {
  setInteraction = 'setInteraction',
  setInteractionSummary = 'setInteractionSummary',
  resetInteraction = 'resetInteraction',
  setInteractionAttributes = 'setInteractionAttributes',
  setInitialSelectedAttributes = 'setInitialSelectedAttributes',
  selectAttr = 'selectAttr',
}

export interface InteractionState {
  interactionId: string
  interactionType: FlowType | null
  summary: any
  attributes: AttrsState<SelectableAttrI>
  selectedAttributes: { [key: string]: string[] } // TODO: to be corrected: instead of string enum
}
