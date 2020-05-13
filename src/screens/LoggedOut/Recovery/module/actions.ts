import { RecoveryActions } from './types'

const partiallyAppliedAction = (type: RecoveryActions) => {
  return (payload?: any) => ({
    type,
    payload,
  })
}

export const setSeedKey = partiallyAppliedAction(RecoveryActions.setSeedKey)
export const setPhrase = partiallyAppliedAction(RecoveryActions.setPhrase)
export const setCurrentWordIdx = partiallyAppliedAction(
  RecoveryActions.setCurrentWordIdx,
)
export const setSuggestedKeys = partiallyAppliedAction(
  RecoveryActions.setSuggestedKeys,
)
