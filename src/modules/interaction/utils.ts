import { InteractionDetails } from './types'
import { getActiveInteraction } from './selectors'
import { createSelector } from 'reselect'

export const createInteractionSelector = <T extends InteractionDetails>(
  guard: (details: InteractionDetails) => details is T,
) =>
  createSelector([getActiveInteraction], (details) => {
    if (!guard(details)) throw new Error('Wrong interaction details')

    return details
  })
