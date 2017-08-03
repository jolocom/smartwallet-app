import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/money', {
  goToEtherManagement: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/ether'))
        dispatch(actions.goToEtherManagement.buildAction(params))
      }
    }
  },
  buyEther: {
    expectedParams: ['stripeToken'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.buyEther.buildAction(params, (backend) => {
          return backend.wallet.buyEther({
            stripeToken: params.stripeToken,
            walletAddress: services.auth.currentUser.wallet.mainAddress
          }).then((response) => {
            dispatch(actions.getBalance())
            return response
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
  },
  goToWalletScreen: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/money'))
        dispatch(actions.goToWalletScreen.buildAction(params))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  ether: {
    screenToDisplay: '',
    loaded: false,
    errorMsg: '',
    price: 0,
    amount: 0,
    checkingOut: false,
    buying: false
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.buyEther.id:
      return state.mergeIn(['ether'], {
        loaded: false,
        errorMsg: '',
        buying: true
      })

    case actions.buyEther.id_success:
      return state.mergeIn(['ether'], {
        loaded: true,
        errorMsg: '',
        buying: false,
        checkingOut: true
      })

    case actions.buyEther.id_fail:
      return state.mergeIn(['ether'], {
        loaded: true,
        errorMsg: 'Could not buy ether',
        buying: false
      })

    case actions.getBalance.id:
      return state.mergeIn(['ether'], {
        loaded: false,
        errorMsg: ''
      })

    case actions.getBalance.id_fail:
      return state.mergeIn(['ether'], {
        loaded: true,
        errorMsg: 'Could not get the user\'s ether balance'
      })

    case actions.getBalance.id_success:
      return state.mergeIn(['ether'], {
        amount: parseFloat(action.result),
        loaded: true,
        errorMsg: ''
      })

    case actions.getPrice.id:
      return state.mergeIn(['ether'], {
        loaded: false,
        errorMsg: ''
      })

    case actions.getPrice.id_success:
      return state.mergeIn(['ether'], {
        price: action.result.ethForEur,
        loaded: true,
        errorMsg: ''
      })

    case actions.getPrice.id_fail:
      return state.mergeIn(['ether'], {
        loaded: true,
        errorMsg: 'Could not get the ether price'
      })

    case actions.goToEtherManagement.id:
      return state.merge({
        screenToDisplay: action.value
      })
    default:
      return state
  }
}
