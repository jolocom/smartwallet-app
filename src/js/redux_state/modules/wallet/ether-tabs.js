import invert from 'lodash/invert'
import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import { actions as moneyActions } from './money'

const PATHNAME_TO_TAB = {
  '/wallet/ether': 'overview',
  '/wallet/ether/send': 'send',
  '/wallet/ether/receive': 'receive'
}

const TAB_TO_PATHNAME = invert(PATHNAME_TO_TAB)

export const actions = makeActions('wallet/ether-tabs', {
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
  sendEther: {
    expectedParams: ['receiverAddress', 'amountSend', 'data', 'pin'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.sendEther.buildAction(params, () => {
          const {receiverAddress, amountSend, data, gasInWei} = getState().toJS().wallet.etherTabs.wallet // eslint-disable-line max-len
          return backend.gateway.sendEther({
            userName: services.auth.currentUser.wallet.userName,
            seedPhrase: services.auth.currentUser.wallet.seedPhrase,
            receiver: receiverAddress,
            amountEther: amountSend,
            data: data,
            gasInWei: gasInWei})
        })).then((response) => {
          dispatch(moneyActions.retrieveEtherBalance())
          return response
        })
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
    errorMsg: '',
    receiverAddress: '',
    amountSend: '',
    pin: '1234',
    data: '',
    gasInWei: 3000000
  }
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.detectActiveTab.id:
      return state.merge({
        activeTab: action.activeTab
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
        loading: true,
        errorMsg: ''
      })

    case actions.sendEther.id_success:
      return state.mergeIn(['wallet'], {
        loading: false,
        errorMsg: '',
        receiverAddress: '',
        amountSend: ''
      })

    case actions.sendEther.id_fail:
      return state.mergeIn(['wallet'], {
        loading: false,
        errorMsg: 'We could not send ether.'
      })

    default:
      return state
  }
}
