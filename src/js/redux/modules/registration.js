import Immutable from 'immutable'
import Mnemonic from 'bitcore-mnemonic'
import * as buffer from 'buffer'
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
      const pathname = state.get('routing').locationBeforeTransitions.pathname

      const toCheck = CHECK_BEFORE_SWITCHING[pathname]
      if (toCheck && !state.getIn(['registration', toCheck, 'valid'])) {
        return
      }

      let nextUrl
      if (pathname === '/registration/user-type') {
        const userType = state.getIn(['registration', 'userType', 'value'])
        nextUrl = userType === 'expert'
                  ? '/registration/write-phrase'
                  : '/registration/phrase-info'
      } else {
        nextUrl = NEXT_ROUTES[pathname]
      }

      dispatch(pushRoute(nextUrl))
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
      return (dispatch, getState, {services}) => {
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
          const randomNumbers = entropy.getRandomNumbers(12)
          dispatch(setPassphrase(
            new Mnemonic(buffer.Buffer.from(randomNumbers), Mnemonic.Words.ENGLISH).toString()
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
export const setUsername = action('registration', 'setUsername', {
  expectedParams: ['value']
})
export const checkUserName = asyncAction('registration', 'checkUserName', {
  expectedParams: ['username'],
  promise: (backend) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 2000)
  })
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

const passwordVisibility = toggleable('registration', 'password', {
  initialValue: false
})
export const {toggle: togglePassword} = passwordVisibility.actions

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
    writtenDown: false
  },
  complete: false
})

export default function reducer(state = initialState, action = {}) {
  state = state.setIn(
    ['password', 'visible'],
    passwordVisibility.reducer(state.get("password").get("visible"), action)
  )

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
      const passwordValue = state.get('password').get('value')
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

      return state.merge({
        pin: {
          value: action.value,
          valid: action.value.length === 4
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
    case checkUserName.id:
      return state.merge({})
    case checkUserName.id_success:
      return state.merge({})
    case checkUserName.id_fail:
      return state.merge({})
    case setEmail.id:
      return state.merge({
        email: {
          value: action.value,
          valid: /([\w.]+)@([\w.]+)\.(\w+)/.test(action.value)
        }
      }
    )
    default:
      return state
  }
}
