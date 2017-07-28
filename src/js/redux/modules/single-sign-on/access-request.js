import Immutable from 'immutable'
import {makeActions} from '../'
import * as router from '../router'

const actions = module.exports = makeActions('single-sign-on/access-request', {
  goToAccessConfirmation: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/single-sign-on/access-confirmation'))
      }
    }
  },
  getRequesterIdentity: {
    expectedParams: [],
    async: true,
    creator: () => {
      return (dispatch) => {
        //here pass to http agent
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
