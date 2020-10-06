import { InteractionDetails } from './types'
import { getActiveInteraction } from './selectors'
import { createSelector } from 'reselect'

/**
 * Creates a selector that returns the @interactionDetails only if
 * it passes the guard check.
 *
 * @param guard - Type guard for the active interaction
 */
export const createInteractionSelector = <T extends InteractionDetails>(
  guard: (details: InteractionDetails) => details is T,
) =>
  createSelector([getActiveInteraction], (details) => {
    if (!guard(details)) throw new Error('Wrong interaction details')

    return details
  })
