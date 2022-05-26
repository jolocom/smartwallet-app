import { InteractionActionType } from './types'
import { createInteractionAction } from './utils'

export * from './ssi/actions'
export * from './ausweis/actions'

export const setDeeplinkConfig = createInteractionAction(
  InteractionActionType.setDeeplinkConfig,
)
