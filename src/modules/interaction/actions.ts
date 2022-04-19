import { InteractionActionType } from './types'
import { createAccountAction } from './utils'

export * from './ssi/actions'

export const setRedirectUrl = createAccountAction(
  InteractionActionType.setRedirectUrl,
)
