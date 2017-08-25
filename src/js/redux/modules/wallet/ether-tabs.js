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
        dispatch(router.pushRoute('/wallet/money'))
      }
    }
  },
  updateField: {
    expectedParams: ['value', 'field'],
    creator: (params) => {
      return (dispatch) => {
        dispatch(actions.updateField.buildAction(params))
      }
    }
  },
  getWalletAddress: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.getWalletAddress.buildAction(params, () => {
          return services.auth.currentUser.wallet.getWalletAddress()
          .then((result) => {
            return result
          })
        }))
      }
    }
  },
  sendEther: {
    expectedParams: ['receiverAddress', 'amountSend', 'data', 'pin'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.sendEther.buildAction(params, () => {
          console.log('ACTIONS SEND ETHER', services.auth.getSeedPhrase)
          const {receiverAddress, amountSend, data, pin, gasInWei} = getState().toJS().wallet.etherTabs.wallet // eslint-disable-line max-len
          return backend.gateway.sendEther({
            userName: services.auth.currentUser.wallet.userName,
            seedPhrase: services.auth.currentUser.encryptedSeedPhrase,
            receiver: receiverAddress,
            amountEther: amountSend,
            data: data,
            gasInWei: gasInWei})
        })).then((response) => {
          dispatch(actions.getBalance())
          return response
        })
      }
    }
  },
  getBalance: {
    async: true,
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.getBalance.buildAction(params, (backend) => {
          const {walletAddress} = getState().toJS().wallet.etherTabs.wallet
          return backend.gateway.getBalanceEther({
            userName: services.auth.currentUser.userName,
            walletAddress: walletAddress
          })
        }))
      }
    }
  },
  closeAccountDetails: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/ether'))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  activeTab: 'overview',
  wallet: {
    loading: false,
    error: '',
    walletAddress: '',
    amount: '',
    receiverAddress: '',
    amountSend: '',
    pin: '1234',
    data: '',
    gasInWei: '200'
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
        loading: true
      })

    case actions.getWalletAddress.id_success:
      return state.mergeIn(['wallet'], {
        loading: false,
        walletAddress: action.result.walletAddress
      })

    case actions.getWalletAddress.id_fail:
      return state.mergeIn(['wallet'], {
        loading: false,
        error: 'OOOOPPPS, something went wrong. Please try again.'
      })

    case actions.updateField.id:
      if (action.field === 'receiverAddress') {
        return state.mergeIn(['wallet'], {
          receiverAddress: action.value
        })
      } else if (action.field === 'amountSend') {
        return state.mergeIn(['wallet'], {
          amountSend: action.value
        })
      }
      return state

    case actions.sendEther.id:
      return state.mergeIn(['wallet'], {
        loading: true
      })

    case actions.sendEther.id_success:
      return state.mergeIn(['wallet'], {
        loading: false,
        error: ''
      })

    case actions.sendEther.id_fail:
      return state.mergeIn(['wallet'], {
        loading: false,
        error: 'OOOOPPPS, something went wrong. Please try again.'
      })

    case actions.getBalance.id:
      return state.mergeIn(['wallet'], {
        loading: true
      })

    case actions.getBalance.id_success:
      return state.mergeIn(['wallet'], {
        loading: false,
        error: '',
        amount: parseFloat(action.result)
      })

    case actions.getBalance.id_fail:
      return state.mergeIn(['wallet'], {
        loading: false,
        error: 'OOOOPPPS, something went wrong. Please try again.'
      })

    case actions.closeAccountDetails.id:
      return state

    default:
      return state
  }
}
