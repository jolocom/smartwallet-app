import * as _ from 'lodash'
import Immutable from 'immutable'
import { makeActions } from './'
import * as router from './router'

const NEXT_ROUTES = {
  '/registration': '/registration/entropy',
  '/registration/entropy': '/registration/user-type',
  '/registration/write-phrase': '/registration/pin',
  '/registration/phrase-info': '/registration/email',
  '/registration/email': '/registration/password',
  '/registration/password': '/registration/pin'
}
const CHECK_BEFORE_SWITCHING = {
  '/registration/user-type': 'userType'
}

const actions = module.exports = makeActions('registration', {
  goForward: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        const state = getState()
        if (state.getIn(['registration', 'complete'])) {
          dispatch(actions.registerWallet())
        } else {
          const nextUrl = helpers._getNextURLFromState(state)
          dispatch(router.pushRoute(nextUrl))
        }
      }
    }
  },
  setHumanName: {
    expectedParams: ['value']
  },
  setUserType: {
    expectedParams: ['value']
  },
  setMaskedImageUncovering: {
    expectedParams: ['value']
  },
  addEntropyFromDeltas: {
    expectedParams: ['dx', 'dy'],
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        if (getState().getIn(
          ['registration', 'passphrase', 'phrase']
        )) {
          return
        }

        const entropy = services.entropy
        entropy.addFromDelta(params.dx)
        entropy.addFromDelta(params.dy)
        if (params.dz) {
          entropy.addFromDelta(params.dz)
        }

        dispatch(actions.setEntropyStatus.buildAction({
          sufficientEntropy: entropy.isReady(),
          progress: entropy.getProgress()
        }))

        if (!getState().getIn(['registration', 'passphrase', 'phrase']) &&
            entropy.isReady()) {
          const randomString = entropy.getRandomString(12)
          dispatch(actions.setPassphrase(
            backend.generateSeedPhrase(randomString)
          ))
        }
      }
    }
  },
  setEntropyStatus: {
    expectedParams: ['sufficientEntropy', 'progress']
  },
  setPassphrase: {
    expectedParams: ['phrase']
  },
  setRandomString: {
    expectedParams: ['randomString']
  },
  setPassphraseWrittenDown: {
    expectedParams: ['value']
  },
  switchToExpertMode: {
    expectedParams: []
  },
  setPin: {
    expectedParams: ['value']
  },
  setPinConfirm: {
    expectedParams: ['value']
  },
  setPinFocused: {
    expectedParams: ['value']
  },
  submitPin: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        const pinState = getState().getIn(['registration', 'pin'])
        if (!pinState.get('valid')) {
          return
        }

        if (pinState.get('confirm')) {
          dispatch(actions.goForward())
        } else {
          dispatch(actions.setPinConfirm(true))
        }
      }
    }
  },
  setUsername: {
    expectedParams: ['value']
  },
  setEmail: {
    expectedParams: ['value']
  },
  setPassword: {
    expectedParams: ['value']
  },
  setRepeatedPassword: {
    expectedParams: ['value']
  },
  registerWallet: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        const state = getState().get('registration').toJS()
        dispatch(actions.registerWallet.buildAction(params, (backend) => {
          const userType = state.userType.value
          if (userType === 'expert') {
            return backend.wallet.registerWithSeedPhrase({
              userName: state.username.value,
              seedPhrase: state.passphrase.phrase
            })
          } else {
            return backend.wallet.registerWithCredentials({
              userName: state.username.value,
              email: state.email.value,
              password: state.password.value
            })
          }
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  humanName: {
    value: '',
    valid: false
  },
  username: {
    value: '',
    valid: false
  },
  email: {
    value: '',
    valid: false
  },
  password: {
    value: '',
    repeated: '',
    valid: false
  },
  pin: {
    value: '',
    focused: false,
    confirm: false,
    valid: false
  },
  userType: {
    value: '',
    valid: false
  },
  maskedImage: {
    uncovering: false
  },
  passphrase: {
    sufficientEntropy: false,
    progress: 0,
    randomString: null,
    phrase: null,
    writtenDown: false,
    valid: false
  },
  wallet: {
    registering: false,
    registered: false,
    errorMsg: null
  },
  complete: false
})

module.exports.default = (state = initialState, action = {}) => {
  state = state.set('complete', helpers._isComplete(state))

  switch (action.type) {
    case actions.setUserType.id:
      const valid = ['expert', 'layman'].indexOf(action.value) !== -1
      if (action.value && !valid) {
        throw Error('Invalid user type: ' + action.value)
      }

      return state.merge({
        userType: {
          value: action.value,
          valid
        }
      })

    case actions.setPassword.id:
      const repeatedValue = state.get('password').get('repeated')
      const validPassword = (
        action.value === repeatedValue &&
        action.value.length > 0
      )

      return state.mergeIn(
        ['password'],
        {
          value: action.value,
          valid: validPassword
        }
      )
    case actions.setRepeatedPassword.id:
      const passwordValue = state.get('password').get('visibleValue')
      const validRepeatedPassword = (
        action.value === passwordValue &&
        action.value.length > 0
      )

      return state.mergeIn(
        ['password'],
        {
          repeated: action.value,
          valid: validRepeatedPassword
        }
      )
    case actions.setEntropyStatus.id:
      return state.merge({
        passphrase: {
          sufficientEntropy: action.sufficientEntropy,
          progress: action.progress
        }
      })
    case actions.setRandomString.id:
      return state.mergeIn(['passphrase'], {
        randomString: action.randomString
      })
    case actions.setPassphrase.id:
      return state.mergeIn(['passphrase'], {
        phrase: action.phrase
      })
    case actions.setPin.id:
      if (!/^[0-9]{0,4}$/.test(action.value)) {
        return state
      }

      return state.mergeIn(['pin'], {
        value: action.value,
        valid: action.value.length === 4
      })
    case actions.setPinConfirm.id:
      return state.mergeDeep({
        pin: {
          confirm: action.value
        }
      })
    case actions.setPinFocused.id:
      return state.mergeDeep({
        pin: {
          focused: action.value
        }
      })
    case actions.setMaskedImageUncovering.id:
      return state.setIn(['maskedImage', 'uncovering'], action.value)

    case actions.setHumanName.id:
      return state.merge({
        humanName: {
          value: action.value,
          valid: action.value !== ''
        }
      })

    case actions.setEmail.id:
      return state.mergeDeep({
        email: {
          value: action.value,
          valid: /([\w.]+)@([\w.]+)\.(\w+)/.test(action.value)
        }
      }
    )
    case actions.setPassphraseWrittenDown.id:
      return state.mergeDeep({
        passphrase: {
          writtenDown: action.value,
          valid: !!state.getIn('passphrase', 'phrase') && action.value
        }
      })
    case actions.registerWallet.id:
      return state.mergeDeep({
        wallet: {
          registering: true,
          registered: false,
          errorMsg: null
        }
      })
    case actions.registerWallet.id_success:
      return state.mergeDeep({
        wallet: {
          registering: false,
          registered: true
        }
      })
    case actions.registerWallet.id_fail:
      return state.mergeDeep({
        wallet: {
          registering: false,
          registered: false,
          errorMsg: action.error.message
        }
      })
    default:
      return state
  }
}

const helpers = module.exports.helpers = {}
helpers._isComplete = (state) => {
  const isFieldValid = (fieldName) => state.getIn([fieldName, 'valid'])
  const areFieldsValid = (fields) => _.every(fields, isFieldValid)

  let complete = areFieldsValid(['username', 'userType', 'pin'])
  if (state.getIn(['userType', 'value']) === 'layman') {
    complete = complete && areFieldsValid(['email', 'password'])
  } else {
    complete = complete && areFieldsValid(['passphrase'])
  }

  return complete
}

helpers._getNextURLFromState = (state) => {
  const currentPath = state.getIn([
    'routing', 'locationBeforeTransitions', 'pathname'
  ])

  if (!helpers._canGoForward(state, currentPath)) {
    return null
  }

  const userType = state.getIn(['registration', 'userType', 'value'])
  return helpers._getNextURL(currentPath, userType)
}

helpers._getNextURL = (currentPath, userType) => {
  if (currentPath === '/registration/user-type') {
    return userType === 'expert'
              ? '/registration/write-phrase'
              : '/registration/phrase-info'
  }

  return NEXT_ROUTES[currentPath]
}

helpers._canGoForward = (state, currentPath) => {
  const toCheck = CHECK_BEFORE_SWITCHING[currentPath]
  return !toCheck || state.getIn(['registration', toCheck, 'valid'])
}
