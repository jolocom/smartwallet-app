export enum RecoveryActions {
  setSeedKey,
  setPhrase,
  setCurrentWordIdx,
  setSuggestedKeys,
}

export interface StateI {
  seedKey: string
  phrase: string[]
  currentWordIdx: number
  suggestedKeys: string[]
}

export interface ActionI {
  type: RecoveryActions
  payload?: any
}
