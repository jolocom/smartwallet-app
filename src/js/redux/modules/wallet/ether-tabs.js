import * as _ from 'lodash'
import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const PATHNAME_TO_TAB = {
  '/wallet/ether': 'overview',
  '/wallet/ether/send': 'send',
  '/wallet/ether/receive': 'receive'
}

const TAB_TO_PATHNAME = _.invert(PATHNAME_TO_TAB)

const actions = module.exports = makeActions('wallet/ether-tabs', {
  detectActiveTab: {
    expectedParams: ['path'],
    creator: (params) => {
      const cleanPath = params.path.replace(/^(.+)\/+$/, '$1')
      const activeTab = PATHNAME_TO_TAB[cleanPath] || 'overview'
      return actions.detectActiveTab.buildAction({path: cleanPath, activeTab})
    }
  },
  switchTab: {
    expectedParams: ['tab'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute(TAB_TO_PATHNAME[params.tab]))
      }
    }
  },
  goToWalletScreen: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(actions.goToWalletScreen.buildAction(params))
        dispatch(router.pushRoute('/wallet/money'))
      }
    }
  },
  getWalletAddress: {
    expectedParams: ['value'],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const value = services.auth.currentUser.wallet.getMainAddress()
        dispatch(actions.getWalletAddress.buildAction(value))
      }
    }
  },
  sendEther: {
    expectedParams: ['receiverAddress', 'amountSend', 'data', 'pin'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.sendEther.buildAction(params, () => {
          const {receiverAddress, amountSend, data, pin} = getState().toJS().wallet.etherTabs.wallet
          console.log('param in sendEther: ', receiverAddress)
          return backend.wallet.sendEther({
            receiver: receiverAddress,
            amountEther: amountSend,
            data: data,
            pin: pin})
          })).then((response) => {
            return response
            console.log('im in response', response)
            // todo getBalance to update balance
            // implement spinner ??
            dispatch(router.pushRoute('/wallet/money'))
          })
      }
    }
  }
})

const initialState = Immutable.fromJS({
  activeTab: 'overview',
  wallet: {
    mainAddress: '',
    receiverAddress: '0xtesttest',
    amountSend: '15',
    pin: '1234',
    data: 'dataTest'
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.detectActiveTab.id:
      return state.merge({
        activeTab: action.activeTab
      })

    case actions.getWalletAddress.id:
      return state.mergeIn(['wallet'], {
        mainAddress: action.value
      })

    case actions.sendEther.id:
    console.log('sedn ether id progress')
    return state

    case actions.sendEther.id_success:
    console.log('send ether id success')
    return state

    case actions.sendEther.id_fail:
    return state

    default:
      return state
  }
}
