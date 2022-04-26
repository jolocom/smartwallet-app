import { InteractionActionType } from './types'
import { createInteractionAction } from './utils'

export * from './ssi/actions'
export * from './ausweis/actions'

export const setRedirectUrl = createInteractionAction(
  InteractionActionType.setRedirectUrl,
)

export const setRefreshUrl = createInteractionAction(
  InteractionActionType.setRefreshUrl,
)
