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
  getMainAddress: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.getMainAddress.buildAction(params, () => {
          return services.auth.currentUser.wallet.getMainAddress()
          .then((mainAddress) => {
            return mainAddress
          })
        }))
      }
    }
  },
  buyEther: {
    expectedParams: ['stripeToken'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.buyEther.buildAction(params, (backend) => {
          const mainAddress = getState().toJS().wallet.money.mainAddress
          return backend.gateway.buyEther({
            stripeToken: params.stripeToken,
            walletAddress: mainAddress
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
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.getBalance.buildAction(params, (backend) => {
          const mainAddress = getState().toJS().wallet.money.mainAddress
          return backend.gateway.getBalanceEther({
            userName: services.auth.currentUser.userName,
            mainAddress: mainAddress
          })
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
          return backend.gateway.retrieveEtherPrice()
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
  },
  goToAccountDetailsEthereum: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        // console.log('go to account details')
        dispatch(router.pushRoute('/wallet/account-details'))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  screenToDisplay: '',
  mainAddress: '',
  ether: {
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
    case actions.getMainAddress.id:
      // TODO loading
      return state

    case actions.getMainAddress.id_success:
      return state.merge({
        mainAddress: action.result
      })

    case actions.getMainAddress.id_fail:
      // TODO error
      return state

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
    case actions.goToAccountDetailsEthereum.id:
      return state

    default:
      return state
  }
}
