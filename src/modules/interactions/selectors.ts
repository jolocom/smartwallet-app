import { RootReducerI } from '~/types/reducer'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

export const getInteractionId = (state: RootReducerI): string =>
  state.interactions.interactionId
export const getInteractionSheet = (state: RootReducerI): FlowType | null =>
  state.interactions.interactionSheet
