import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

export enum AccountActionTypes {
  setDid = 'setDid',
  setEntropy = 'setEntropy',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
  lockApp = 'lockApp',
  unlockApp = 'unlockApp',
  setLocalAuth = 'setLocalAuth',
  accountReset = 'accountReset',
  setInteraction = 'setInteraction',
  resetInteraction = 'resetInteraction',
  setInteractionSheet = 'setInteractionSheet',
  resetInteractionSheet = 'resetInteractionSheet',
}

export interface AccountState {
  did: string
  entropy: string
  loggedIn: boolean
  isAppLocked: boolean
  isLocalAuthSet: boolean
  interactionId: string
  interactionSheet: FlowType | null
}

export interface Action {
  type: AccountActionTypes
  payload?: any
}
