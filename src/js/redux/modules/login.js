import Immutable from 'immutable'
import { makeActions } from './'
import * as router from './router'

const actions = module.exports = makeActions('wallet/identity', {
  setPassphrase: {
    expectedParams: ['value']
  },
  resetPassphrase: {
    expectedParams: []
  },
  submitPassphrase: {
    expectedParams: ['value'],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        const state = getState().get('login').toJS()
        dispatch(actions.submitPassphrase.buildAction(params, (backend) => {
          return backend.wallet
            .checkPassphrase({passphrase: state.passphrase.value})
            .then(() => dispatch(router.pushRoute('/login/expert/pin-entry')))
        }))
      }
    }
  },
  setPin: {
    expectedParams: ['value']
  },
  setPinFocused: {
    expectedParams: ['value']
  },
  resetPin: {
    expectedParams: []
  },
  goForward: {
    expectedParams: ['value'],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        const state = getState().get('login').toJS()
        dispatch(actions.goForward.buildAction(params, (backend) => {
          return backend.wallet
            .expertLogin({passphrase: state.passphrase.value,
              pin: state.pin.value})
            .then(() => dispatch(router.pushRoute('/wallet/identity')))
        }))
      }
    }
  },
  goToLogin: {
    expectedParams: [],
    creator: () => {
      return (dispatch) => {
        dispatch(router.pushRoute('/login/expert'))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  passphrase: {
    value: '',
    failed: false,
    valid: false,
    errorMsg: ''
  },
  pin: {
    value: '',
    focused: false,
    failed: false,
    valid: false,
    errorMsg: ''
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.setPassphrase.id:
      return state.mergeDeep({
        passphrase: {
          value: action.value,
          valid: action.value.length > 0
        }
      })

    case actions.resetPassphrase.id:
      return state.mergeDeep({
        passphrase: {
          value: '',
          valid: false,
          failed: false
        }
      })

    case actions.submitPassphrase.id_success:
      return state.mergeDeep({
        passphrase: {
          errorMsg: '',
          valid: true,
          failed: false
        }
      })

    case actions.submitPassphrase.id_fail:
      return state.mergeDeep({
        passphrase: {
          errorMsg: 'Your passphrase is not correct',
          valid: false,
          failed: true
        }
      })

    case actions.setPin.id:
      if (!(/^[0-9]{0,4}$/).test(action.value)) {
        return state
      }
      return state.mergeDeep({
        pin: {
          value: action.value,
          valid: action.value.length === 4
        }
      })

    case actions.setPinFocused.id:
      return state.mergeDeep({
        pin: {
          focused: action.value
        }
      })

    case actions.resetPin.id:
      return state.mergeDeep({
        pin: {
          value: '',
          valid: false,
          failed: false
        }
      })
    case actions.goForward.id_fail:
      return state.mergeDeep({
        pin: {
          errorMsg: 'Your Pin is Not correct!',
          failed: true,
          valid: false
        }
      })
    case actions.goForward.id_success:
      return state.mergeDeep({
        pin: {
          errorMsg: '',
          failed: false,
          valid: true
        },
        passphrase: {
          errorMsg: '',
          failed: false,
          valid: true
        }
      })

    default:
      return state
  }
}
