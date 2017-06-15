import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

module.exports = makeActions('wallet/money', {
  goToEtherManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/ether'))
      }
    }
  }
})

const initialState = Immutable.fromJS({
})

module.exports.default = (state = initialState, action = {}) => {
  return state
}
