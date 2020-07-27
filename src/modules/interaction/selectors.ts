import { RootReducerI } from '~/types/reducer'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { createSelector } from 'reselect'
import { AttrsState, AttributeI } from '../attributes/types'
import { IntermediaryState } from './types'

export const getInteractionId = (state: RootReducerI): string =>
  state.interaction.interactionId
export const getInteractionType = (state: RootReducerI): FlowType | null =>
  state.interaction.interactionType
// TODO: add type annotation
export const getInteractionSummary = (state: RootReducerI): any =>
  state.interaction.summary
export const getInteractionAttributes = (
  state: RootReducerI,
): AttrsState<AttributeI> => state.interaction.attributes
export const getSelectedAttributes = (
  state: RootReducerI,
): { [key: string]: string } => state.interaction.selectedAttributes

export const getIntermediaryState = (state: RootReducerI): any =>
  state.interaction.intermediaryState

export const getAttributeInputKey = (state: RootReducerI): any =>
  state.interaction.attributeInputKey

export const getIsFullScreenInteraction = createSelector(
  [getInteractionType, getInteractionSummary, getIntermediaryState],
  (type, summary, intermediaryState) => {
    if (intermediaryState !== IntermediaryState.absent) {
      return false
    } else if (
      type === FlowType.CredentialShare &&
      summary.state &&
      summary.state.constraints[0].credentialRequirements.length > 1
    ) {
      return true
    } else if (
      type === FlowType.CredentialReceive &&
      summary.state &&
      summary.state.offerSummary.length > 1
    ) {
      return true
    } else {
      return false
    }
  },
)
