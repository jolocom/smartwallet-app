import { StateI, ActionI, RecoveryActions } from './types'
export const initialState = {
  seedKey: '', // input value
  phrase: [],
  currentWordIdx: 0,
  suggestedKeys: [],
}

const reducer = (state: StateI, action: ActionI): StateI => {
  switch (action.type) {
    case RecoveryActions.setSeedKey:
      return onUpdateProp(state, action, 'seedKey')
    case RecoveryActions.setPhrase:
      return onUpdateProp(state, action, 'phrase')
    case RecoveryActions.setCurrentWordIdx:
      return onUpdateProp(state, action, 'currentWordIdx')
    case RecoveryActions.setSuggestedKeys:
      return onUpdateProp(state, action, 'suggestedKeys')
  }
}

const onUpdateProp = (state: StateI, action: ActionI, prop: string) => {
  return { ...state, [prop]: action.payload }
}

export default reducer
