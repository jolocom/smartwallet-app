import createAction from '~/utils/createAction'
import { InteractionAction, InteractionActions } from './types'

export function createAccountAction<K extends keyof InteractionActions>(
  type: K,
) {
  return createAction<InteractionAction<K>>(type)
}
