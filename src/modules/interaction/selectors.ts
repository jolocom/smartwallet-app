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

export const isInteractionMultiple = createSelector(
  getInteractionSummary,
  (summary) => summary.length,
)
