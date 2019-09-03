import { AnyAction } from 'redux'
import { LabeledShard } from '../ui/recovery/container/receivedShards'
import { ActionTypes } from '../actions/recovery'

export interface RecoveryState {
  readonly ownShards: string[]
  readonly receivedShards: LabeledShard[]
}

const initialState: RecoveryState = {
  ownShards: [],
  receivedShards: [],
}

export const recoveryReducer = (
  state = initialState,
  action: AnyAction,
): RecoveryState => {
  switch (action.type) {
    case ActionTypes.SET_OWN_SHARDS:
      return {
        ...state,
        ownShards: action.value,
      }
    case ActionTypes.SET_RECEIVED_SHARDS:
      return {
        ...state,
        receivedShards: action.value,
      }
    default:
      return state
  }
}
