import { RootReducerI } from '~/types/reducer'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { createSelector } from 'reselect'

export const getInteractionId = (state: RootReducerI): string =>
  state.interaction.interactionId
export const getInteractionSheet = (state: RootReducerI): FlowType | null =>
  state.interaction.interactionSheet
// TODO: add type annotation
export const getInteractionSummary = (state: RootReducerI): any =>
  state.interaction.summary

export const getIsFullScreenInteraction = createSelector(
  [getInteractionSheet, getInteractionSummary],
  (type, summary) => {
    if (
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
