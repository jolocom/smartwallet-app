import { AnyAction } from 'redux'
import { ActionTypes } from '../actions/recovery'
import { ShardEntity } from '../lib/storage/entities/shardEntity'

export interface RecoveryState {
  readonly ownShards: ShardEntity[]
  readonly receivedShards: ShardEntity[]
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
