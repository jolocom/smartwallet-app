import { InteractionActionType } from '../types'
import { createInteractionAction } from '../utils'

export const setAusweisInteractionDetails = createInteractionAction(
  InteractionActionType.setDetails,
)

export const setAusweisScannerKey = createInteractionAction(
  InteractionActionType.setScannerKey,
)

export const setAusweisReaderState = createInteractionAction(
  InteractionActionType.setReaderState,
)

export const setAusweisFlowType = createInteractionAction(
  InteractionActionType.setFlowType,
)
