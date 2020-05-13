export enum Actions {
  updateSeedKey,
  updatePhrase,
  updateCurrentWordIdx,
  setSuggestedKeys,
}

export interface StateI {
  seedKey: string
  phrase: string[]
  currentWordIdx: number
  suggestedKeys: string[]
}

export interface ActionI {
  type: Actions
  payload: any
}

export const initialState = {
  seedKey: '',
  phrase: [],
  currentWordIdx: 0,
  suggestedKeys: [],
}

const reducer = (state: StateI, action: ActionI): StateI => {
  switch (action.type) {
    case Actions.updateSeedKey:
      return onUpdateProp(state, action, 'seedKey')
    case Actions.updatePhrase:
      return onUpdatePhrase(state, action)
    case Actions.updateCurrentWordIdx:
      return onUpdateProp(state, action, 'currentWordIdx')
    case Actions.setSuggestedKeys:
      return onUpdateProp(state, action, 'suggestedKeys')
  }
}

const onUpdateProp = (state: StateI, action: ActionI, prop: string) => {
  return { ...state, [prop]: action.payload }
}

const onUpdatePhrase = (state: StateI, action: ActionI) => {
  const updatedPhrase = state.phrase.slice()
  return {
    ...state,
    phrase: [...updatedPhrase, action.payload],
  }
}

export default reducer
