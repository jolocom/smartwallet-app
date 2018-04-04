import { AnyAction } from 'redux'
import { combineReducers } from 'redux'
import { seedPhrase } from 'src/reducers/registration/seedPhrase'

export const entropy = (state = {}, action: AnyAction): any => {
  // console.log(action, state, 'reducer')
  switch (action.type) {
    case 'ENTROPY_READY':
      return Object.assign({}, state, {
      encodedEntropy: action.value
      })
    default:
      return state
  }
}

export const registrationReducer = combineReducers({
  seedPhrase
})
