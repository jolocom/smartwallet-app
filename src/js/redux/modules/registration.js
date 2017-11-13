import * as _ from 'lodash'
import Immutable from 'immutable'
import { makeActions } from './'
import * as router from './router'
import { isPasswordValid, checkPassStrength,
  passwordCharacters } from '../../lib/password-util'

const NEXT_ROUTES = {
  '/registration': '/registration/entropy',
  '/registration/entropy': '/registration/user-type',
  '/registration/user-type': '/registration/phrase-info',
  '/registration/phrase-info': '/registration/email',
  '/registration/email': '/registration/password',
  '/registration/password': '/registration/pin',
  '/registration/write-phrase': '/registration/pin'
}

const CHECK_BEFORE_SWITCHING = {
  '/registration': ['username', 'valid'],
  '/registration/entropy': ['passphrase', 'sufficientEntropy'],
  '/registration/user-type': ['userType', 'valid'],
  '/registration/write-phrase': ['passphrase', 'writtenDown'],
  '/registration/phrase-info': ['passphrase', 'writtenDown'],
  '/registration/email': ['email', 'valid'],
  '/registration/password': ['password', 'valid'],
  '/registration/pin': ['pin', 'valid']
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
  setUserType: {
    expectedParams: ['value']
  },
  setMaskedImageUncovering: {
    expectedParams: ['value']
  },
  addEntropyFromDeltas: {
    expectedParams: ['x', 'y'],
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        if (getState().getIn(
          ['registration', 'passphrase', 'phrase']
        )) {
          return
        }

        const entropy = services.entropy
        entropy.addFromDelta(params.x)
        entropy.addFromDelta(params.y)
        if (params.dz) {
          entropy.addFromDelta(params.z)
        }

        dispatch(actions.setEntropyStatus.buildAction({
          sufficientEntropy: entropy.getProgress() >= 1,
          progress: entropy.getProgress()
        }))

        if (entropy.isReady()) {
          const randomString = entropy.getRandomString(12)
          dispatch(actions.setRandomString(randomString))
          dispatch(actions.generateSeedPhrase(
            backend.gateway.generateSeedPhrase(randomString)
          ))
        }
      }
    }
  },
  generateSeedPhrase: {
    expectedParams: [],
    // I want to await the async resolution of the generateSeedPhrase Promise
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend}) => {
        // set state to registration state tree
        const state = getState().get('registration').toJS()
        // action creator, which will then be dispatched on 74
        dispatch(actions.generateSeedPhrase.buildAction(params, async () => {
          await backend.gateway.generateSeedPhrase({
            randomString: state.passphrase.randomString
          })
          .then((params) => {
            dispatch(actions.setPassphrase(params))
            dispatch(actions.setPassphraseWrittenDown(true))
          })
        }))
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
        dispatch(actions.goForward())
      }
    }
  },
  setUsername: {
    expectedParams: ['value']
  },
  setEmail: {
    expectedParams: ['value']
  },
  checkEmail: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        const emailState = getState().getIn(['registration', 'email'])
        if (emailState.get('valid')) {
          dispatch(actions.goForward())
        } else {
          dispatch(actions.emailError())
        }
      }
    }
  },
  emailError: {
    expectedParams: []
  },
  setPassword: {
    expectedParams: ['value']
  },
  setRepeatedPassword: {
    expectedParams: ['value']
  },
  setValueOwnURL: {
    expectedParams: ['value']
  },
  toggleHasOwnURL: {
    expectedParams: ['value']
  },
  checkCredentials: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        const state = getState().get('registration').toJS()
        dispatch(actions.checkCredentials.buildAction(params, (backend) => {
          return backend.gateway
            .checkUserDoesNotExist({userName: state.username.value})
            .then((params) => {
              if (state.ownURL.valueOwnURL.length > 1) {
                dispatch(actions.checkOwnUrl())
              } else {
                dispatch(actions.goForward())
              }
            })
        }))
      }
    }
  },
  checkOwnUrl: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend}) => {
        const state = getState().get('registration').toJS()
        dispatch(actions.checkOwnUrl.buildAction(params, (backend) => {
          return backend.gateway.checkOwnUrlDoesExist({
            userName: state.username.value,
            gatewayUrl: state.ownURL.valueOwnURL
          })
          .then((params) => {
            dispatch(actions.goForward())
          })
        }))
      }
    }
  },
  registerWallet: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        const state = getState().get('registration').toJS()
        dispatch(actions.registerWallet.buildAction(params, async () => {
          const userType = state.userType.value
          if (userType === 'expert') {
            console.log(state.ownURL, "here is your url in registerWallet")
            await services.auth.register({
              userName: state.username.value,
              seedPhrase: state.passphrase.phrase,
              inviteCode: state.inviteCode,
              gatewayUrl: state.ownURL.valueOwnURL
            })

            await services.auth.login({
              seedPhrase: state.passphrase.phrase,
              pin: state.pin.value,
              gatewayUrl: state.ownURL.valueOwnURL
            })

            dispatch(router.pushRoute('/wallet'))
          } else {
            // console.log('layman registration')

            // return true
            // return services.auth.registerWithCredentials({
            //   userName: state.username.value,
            //   email: state.email.value,
            //   password: state.password.value,
            //   pin: state.pin.value
            // })
            // const { wallet } = await services.auth.registerWithCredentials({
            //   userName: state.username.value,
            //   email: state.email.value,
            //   password: state.password.value,
            //   pin: state.pin.value,
            //   seedPhrase: state.passphrase.phrase
            // })

            // await backend.accounts.solidRegister(
            //   state.username.value,
            //   state.passphrase.phrase,
            //   wallet.webIDPrivateKey
            // )

            // await backend.accounts.solidLogin(
            //   state.username.value,
            //   state.passphrase.phrase,
            //   wallet.webIDPrivateKey
            // )

            // await backend.solid.setIdentityContractAddress(
            //   wallet.webId,
            //   wallet.identityAddress
            // )

            // dispatch(router.pushRoute('/wallet'))
          }
        })
      )
      }
    }
  },
  setInviteCode: {
    expectedParams: ['value']
  }
})

const initialState = Immutable.fromJS({
  username: {
    value: '',
    checking: false,
    errorMsg: '',
    valid: false,
    alphaNum: false
  },
  Repuation: 0,
  email: {
    value: '',
    valid: false,
    errorMsg: ''
  },
  password: {
    value: '',
    repeated: '',
    strength: 'weak',
    hasLowerCase: false,
    hasUpperCase: false,
    hasDigit: false,
    valid: false
  },
  ownURL: {
    hasOwnURL: false,
    errorMsg: '',
    valueOwnURL: ''
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
    randomString: '',
    phrase: '',
    generating: false,
    generated: false,
    writtenDown: false,
    valid: false
  },
  wallet: {
    registering: false,
    registered: false,
    errorMsg: null
  },
  inviteCode: null,
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
      const oldRepeatedValue = state.get('password').get('repeated')
      const validPassword = isPasswordValid(action.value, oldRepeatedValue)
      const characters = passwordCharacters(action.value)
      const passwordStrength = checkPassStrength(action.value)
      return state.mergeIn(
        ['password'],
        {
          value: action.value,
          repeated: '',
          valid: validPassword,
          hasLowerCase: characters.lowerCase,
          hasUpperCase: characters.upperCase,
          hasDigit: characters.digit,
          strength: passwordStrength
        }
      )

    case actions.setRepeatedPassword.id:
      const passwordValue = state.get('password').get('value')
      const validRepeatedValue = isPasswordValid(action.value, passwordValue)
      return state.mergeIn(['password'], {
        repeated: action.value,
        valid: validRepeatedValue
      })

    case actions.setEntropyStatus.id:
      return state.mergeDeep({
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

    case actions.generateSeedPhrase.id:
     return state.mergeDeep({
        passphrase: {
          generating: true,
          generated: false,
          errorMsg: null
        }
      })

    case actions.generateSeedPhrase.id_fail:
      return state.mergeDeep({
        passphrase: {
          generating: false,
          generated: false,
          errorMsg: 'generating passphrase has failed'
        }
      })

    case actions.generateSeedPhrase.id_success:
      return state.mergeDeep({
        passphrase: {
          generating: false,
          generated: true,
          errorMsg: null
        }
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

    case actions.setEmail.id:
      return state.mergeDeep({
        email: {
          value: action.value,
          valid: /^([\w.]+)@([\w.]+)\.(\w+)/.test(action.value),
          errorMsg: ''
        }
      })

    case actions.emailError.id:
      return state.mergeDeep({
        email: {
          errorMsg: 'This email address is invalid. Please check it again'
        }
      })

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
          registering: true,
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

    case actions.setUsername.id:
      return state.mergeDeep({
        username: {
          value: action.value,
          alphaNum: (/^[a-z0-9]+$/i.test(action.value)),
          valid: action.value.trim() !== '',
          errorMsg: ''
        }
      })

    case actions.checkCredentials.id:
      return state.mergeDeep({
        username: {
          checking: true
        }
      })

    case actions.checkCredentials.id_success:
      return state.mergeDeep({
        username: {
          checking: false,
          errorMsg: ''
        }
      })

    case actions.checkCredentials.id_fail:
      return state.mergeDeep({
        username: {
          checking: false,
          errorMsg: action.error.message
        }
      })

    case actions.setInviteCode.id:
      return state.merge({
        inviteCode: action.code
      })

    case actions.toggleHasOwnURL.id:
      return state.mergeIn(['ownURL'], {
        hasOwnURL: action.value
      })

    case actions.setValueOwnURL.id:
      return state.mergeIn(['ownURL'], {
        valueOwnURL: action.value
      })

    case actions.checkOwnUrl.id:
      return state.mergeIn(['ownURL'], {
        errorMsg: ''
      })

    case actions.checkOwnUrl.id_success:
      return state.mergeIn(['ownURL'], {
        errorMsg: ''
      })

    case actions.checkOwnUrl.id_fail:
      return state.mergeIn(['ownURL'], {
        errorMsg: action.error.message
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
  const currentPath = state.get('routing').locationBeforeTransitions.pathname
  const userType = state.getIn(['registration', 'userType', 'value'])
  if (!helpers._canGoForward(state, currentPath)) {
    if ((currentPath === '/registration/write-phrase') &&
      (userType === 'layman')) {
      return '/registration/phrase-info'
    }
    if ((currentPath === '/registration/phrase-info') &&
      (userType === 'expert')) {
      return '/registration/write-phrase'
    }
    return null
  }
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
  let result = !toCheck || state.getIn(['registration', toCheck[0], toCheck[1]])
  return result || false
}
