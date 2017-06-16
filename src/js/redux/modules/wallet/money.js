import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/money', {
  goToEtherManagement: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/ether'))
      }
    }
  },
  buyEther: {
    expectedParams: ['value'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.buyEther.buildAction(params, () => {
          console.log('buy Ether ======>')
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }))
      }
    }
  },
  getBalance: {
    async: true,
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.getBalance.buildAction(params, () =>
          services.auth.currentUser.wallet.getBalance()
        ))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  ether: {
    price: 0,
    amount: 0
  }
})

module.exports.default = (state = initialState, action = {}) => {
  return state
}
