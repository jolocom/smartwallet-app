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
  retrieveWalletAddress: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.retrieveEtherBalance.buildAction(params, async () => {
          let walletAddress = getState().getIn([
            'wallet', 'money', 'walletAddress'
          ])
          if (!walletAddress) {
            walletAddress = await services.auth.currentUser
              .wallet.getWalletAddress()
            dispatch(actions.setWalletAddress(walletAddress))
          }
        }))
      }
    }
  },
  retrieveEtherBalance: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.retrieveEtherBalance.buildAction(params, async () => {
          let walletAddress = getState().getIn([
            'wallet', 'money', 'walletAddress'
          ])
          if (!walletAddress) {
            walletAddress = (await services.auth.currentUser
              .wallet.getWalletAddress()).walletAddress
            dispatch(actions.setWalletAddress(walletAddress))
          }

          const balance = await backend.gateway.getBalanceEther({
            userName: services.auth.currentUser.wallet.userName,
            walletAddress: walletAddress
          })
          dispatch(actions.setEtherBalance(balance.ether))
          return balance
        }))
      }
    }
  },
  setWalletAddress: {
    expectedParams: ['walletAddress']
  },
  setEtherBalance: {
    expectedParams: ['ether']
  },
  buyEther: {
    expectedParams: ['stripeToken'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.buyEther.buildAction(params, (backend) => {
          const {walletAddress} = getState().toJS().wallet.etherTabs.wallet
          return backend.gateway.buyEther({
            stripeToken: params.stripeToken,
            walletAddress: walletAddress
          }).then((response) => {
            dispatch(actions.retrieveEtherBalance())
            return response
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
        dispatch(router.pushRoute('/wallet/account-details'))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  screenToDisplay: '',
  walletAddress: '',
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
    case actions.retrieveEtherBalance.id:
      return state.mergeIn(['ether'], {
        loaded: false,
        errorMsg: ''
      })

    case actions.retrieveEtherBalance.id_success:
      return state.mergeDeep({
        ether: {
          loaded: true,
          errorMsg: ''
        }
      })

    case actions.retrieveEtherBalance.id_fail:
      return state.mergeIn(['ether'], {
        errorMsg: 'Could not get your Ether balance.',
        loaded: true
      })

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

    case actions.getPrice.id:
      return state.mergeIn(['ether'], {
        errorMsg: ''
      })

    case actions.getPrice.id_success:
      return state.mergeIn(['ether'], {
        price: action.result.ethForEur,
        errorMsg: ''
      })

    case actions.getPrice.id_fail:
      return state.mergeIn(['ether'], {
        errorMsg: 'Could not get the ether price'
      })

    case actions.goToEtherManagement.id:
      return state.merge({
        screenToDisplay: action.value
      })

    case actions.setWalletAddress.id:
      return state.mergeDeep({
        walletAddress: action.walletAddress
      })

    case actions.setEtherBalance.id:
      return state.mergeDeep({
        amount: parseFloat(action.ether)
      })

    default:
      return state
  }
}
