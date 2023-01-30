import { InteractionActionType } from '../types'
import { createInteractionAction } from '../utils'

export const setMdoc = createInteractionAction(InteractionActionType.setMdoc)

export const setIsPersonalizingMdl = createInteractionAction(
  InteractionActionType.setIsPersonalizingMdl,
)
