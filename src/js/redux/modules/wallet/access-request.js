import Immutable from 'immutable'
import {makeActions} from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/access-request', {
  goToAccessConfirmation: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/access-confirmation'))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  entity: {
    name: 'SOME COMPANY',
    image: 'img/logo.svg'
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {

    default:
      return state
  }
}
