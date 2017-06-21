import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/money', {
  goToEtherManagement: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/ether'))
        dispatch(actions.goToEtherManagement.buildAction(params))
      }
    }
  },
  buyEther: {
    expectedParams: ['value'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.buyEther.buildAction(params, () => {
          console.log('buy Ether ') // eslint-disable-line no-console
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
        dispatch(actions.getBalance.buildAction(params, () => {
          return services.auth.currentUser.wallet.getBalance()
        }))
      }
    }
  },
  getPrice: {
    async: true,
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.getPrice.buildAction(params, (backend) => {
          return backend.wallet.retrieveEtherPrice()
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  ether: {
    loaded: false,
    price: 0,
    amount: 0,
    checkingOut: false,
    buying: false
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.buyEther.id:
      return state

    case actions.buyEther.id_success:
      return state

    case actions.buyEther.id_fail:
      return state

    case actions.getBalance.id:
      return state

    case actions.getBalance.id_fail:
      return state

    case actions.getBalance.id_success:
      return state.mergeIn(['ether'], {
        amount: action.result
      })

    case actions.getPrice.id:
      return state

    case actions.getPrice.id_success:
      return state.mergeIn(['ether'], {
        price: action.result.ethForEur
      })

    case actions.getPrice.id_fail:
      return state

    default:
      return state
  }
}
