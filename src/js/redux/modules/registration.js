import Immutable from 'immutable'
import { action } from './'
import { pushRoute } from './router'

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
export const addMaskedImagePoint = action(
  'registration', 'addMaskedImagePoint',
  {
    expectedParams: ['x', 'y']
  }
)
export const addEntropyFromDeltas = action(
  'registration', 'addEntropyFromDeltas',
  {
    expectedParams: ['x', 'y', 'z']
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
export const setEmail = action('registration', 'setEmail', {
  expectedParams: ['value']
})
export const setPassword = action('registration', 'setPassword', {
  expectedParams: ['value']
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
    uncovered: []
  },
  passphrase: {
    sufficientEntropy: false,
    randomString: null,
    phrase: null,
    writtenDown: false
  },
  complete: false
})

export default function reducer(state = initialState, action = {}) {
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
    case setPin.id:
      if (!/[0-9]{0,4}/.test(action.value)) {
        return state
      }

      return state.merge({
        value: action.value,
        valid: action.value.length === 4
      })
    default:
      return state
  }
}
