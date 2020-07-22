import { RootReducerI } from '~/types/reducer'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { createSelector } from 'reselect'
import { IntermediaryState } from './types'

export const getInteractionId = (state: RootReducerI): string =>
  state.interaction.interactionId
export const getInteractionType = (state: RootReducerI): FlowType | null =>
  state.interaction.interactionType
// TODO: add type annotation
export const getInteractionSummary = (state: RootReducerI): any =>
  state.interaction.summary

export const getIntermediaryState = (state: RootReducerI): any =>
  state.interaction.intermediaryState

export const getIntermediaryInputType = (state: RootReducerI): any =>
  state.interaction.intermediaryInputType

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
