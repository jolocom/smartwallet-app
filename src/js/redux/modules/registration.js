import * as _ from 'lodash'
import Immutable from 'immutable'
import { action, asyncAction } from './'
import { pushRoute } from './router'
import toggleable from './generic/toggleable'

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

export const goForward = action('registration', 'goForward', {
  expectedParams: [],
  creator: () => {
    return (dispatch, getState) => {
      const state = getState()
      if (state.getIn(['registration', 'complete'])) {
        dispatch(registerWallet())
      } else {
        const nextUrl = _getNextURLFromState(state)
        dispatch(pushRoute(nextUrl))
      }
    }
  }
})
export const setHumanName = action('registration', 'setHumanName', {
  expectedParams: ['value']
})
export const setUserType = action('registration', 'setUserType', {
  expectedParams: ['value']
})
export const setMaskedImageUncovering = action(
  'registration', 'setMaskedImageUncovering',
  {
    expectedParams: ['value']
  }
)
export const addEntropyFromDeltas = action(
  'registration', 'addEntropyFromDeltas',
  {
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

        dispatch(setEntropyStatus.buildAction({
          sufficientEntropy: entropy.isReady(),
          progress: entropy.getProgress()
        }))

        if (!getState().getIn(['registration', 'passphrase', 'phrase']) &&
            entropy.isReady()) {
          const randomString = entropy.getRandomString(12)
          dispatch(setPassphrase(
            backend.generateSeedPhrase(randomString)
          ))
        }
      }
    }
  }
)
const setEntropyStatus = action(
  'registration', 'setEntropyStatus',
  {
    expectedParams: ['sufficientEntropy', 'progress']
  }
)
const setPassphrase = action(
  'registration', 'setPassphrase',
  {
    expectedParams: ['phrase']
  }
)
const setRandomString = action(
  'registration', 'setRandomString',
  {
    expectedParams: ['randomString']
  }
)
export const setPassphraseWrittenDown = action(
  'registration', 'setPassphraseWrittenDown',
  {
    expectedParams: ['value']
  }
)
export const switchToExpertMode = action('registration', 'switchToExpertMode', {
  expectedParams: []
})
export const setPin = action('registration', 'setPin', {
  expectedParams: ['value']
})
export const setPinConfirm = action('registration', 'setPinConfirm', {
  expectedParams: ['value']
})
export const setPinFocused = action('registration', 'setPinFocused', {
  expectedParams: ['value']
})
export const submitPin = action('registration', 'submitPin', {
  expectedParams: [],
  creator: () => {
    return (dispatch, getState) => {
      const pinState = getState().getIn(['registration', 'pin'])
      if (!pinState.get('valid')) {
        return
      }

      if (pinState.get('confirm')) {
        dispatch(goForward())
      } else {
        dispatch(setPinConfirm(true))
      }
    }
  }
})
export const setUsername = action('registration', 'setUsername', {
  expectedParams: ['value']
})
export const setEmail = action('registration', 'setEmail', {
  expectedParams: ['value']
})
export const setPassword = action('registration', 'setPassword', {
  expectedParams: ['value']
})
export const setRepeatedPassword = action(
  'registration', 'setRepeatedPassword',
  {
    expectedParams: ['value']
  }
)
export const registerWallet = asyncAction('registration', 'registerWallet', {
  expectedParams: [],
  creator: (params) => {
    return (dispatch, getState) => {
      const state = getState().get('registration').toJS()
      dispatch(registerWallet.buildAction(params, (backend) => {
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
})

const passwordValueVisibility = toggleable('registration', 'passwordValue', {
  initialValue: false
})
export const {toggle: togglePasswordValue} = passwordValueVisibility.actions

const passwordRepeatedValueVisibility = toggleable('registration', 'passwordRepeatedValue', {
  initialValue: false
})
export const {toggle: togglePasswordRepeatedValue} = passwordRepeatedValueVisibility.actions

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

export default function reducer(state = initialState, action = {}) {
  state = state.mergeIn(
    ['password'],{
      visibleValue: passwordValueVisibility.reducer(
        state.get('password').get('visibleValue'),
        action
      ),
      visibleRepeatedValue: passwordRepeatedValueVisibility.reducer(
        state.get('password').get('visibleRepeatedValue'),
        action
      )
    }
  )
  state = state.set('complete', _isComplete(state))

  switch (action.type) {
    case setUserType.id:
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

    case setPassword.id:
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
    case setRepeatedPassword.id:
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
    case setEntropyStatus.id:
      return state.merge({
        passphrase: {
          sufficientEntropy: action.sufficientEntropy,
          progress: action.progress
        }
      })
    case setRandomString.id:
      return state.mergeIn(['passphrase'], {
        randomString: action.randomString
      })
    case setPassphrase.id:
      return state.mergeIn(['passphrase'], {
        phrase: action.phrase
      })
    case setPin.id:
      if (!/^[0-9]{0,4}$/.test(action.value)) {
        return state
      }

      return state.mergeIn(['pin'], {
        value: action.value,
        valid: action.value.length === 4
      })
    case setPinConfirm.id:
      return state.mergeDeep({
        pin: {
          confirm: action.value
        }
      })
    case setPinFocused.id:
      return state.mergeDeep({
        pin: {
          focused: action.value
        }
      })
    case setMaskedImageUncovering.id:
      return state.setIn(['maskedImage', 'uncovering'], action.value)

    case setHumanName.id:
      return state.merge({
        humanName: {
          value: action.value,
          valid: action.value !== ''
        }
      })

    case setEmail.id:
      return state.mergeDeep({
        email: {
          value: action.value,
          valid: /([\w.]+)@([\w.]+)\.(\w+)/.test(action.value)
        }
      }
    )
    case setPassphraseWrittenDown.id:
      return state.mergeDeep({
        passphrase: {
          writtenDown: action.value,
          valid: !!state.getIn('passphrase', 'phrase') && action.value
        }
      })
    case registerWallet.id:
      return state.mergeDeep({
        wallet: {
          registering: true,
          registered: false,
          errorMsg: null
        }
      })
    case registerWallet.id_success:
      return state.mergeDeep({
        wallet: {
          registering: false,
          registered: true
        }
      })
    case registerWallet.id_fail:
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

export function _isComplete(state) {
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

export function _getNextURLFromState(state) {
  const currentPath = state.get('routing').locationBeforeTransitions.pathname

  if (!_canGoForward(state, currentPath)) {
    return
  }

  const userType = state.getIn(['registration', 'userType', 'value'])
  return _getNextURL(currentPath, userType)
}

export function _getNextURL(currentPath, userType) {
  if (currentPath === '/registration/user-type') {
    return userType === 'expert'
              ? '/registration/write-phrase'
              : '/registration/phrase-info'
  }

  return NEXT_ROUTES[currentPath]
}

export function _canGoForward(state, currentPath) {
  const toCheck = CHECK_BEFORE_SWITCHING[currentPath]
  return !toCheck || !state.getIn(['registration', toCheck, 'valid'])
}
