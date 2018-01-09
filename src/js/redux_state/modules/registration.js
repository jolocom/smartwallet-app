import every from 'lodash/every'
import Immutable from 'immutable'
import { makeActions } from './'
import { deriveMasterKeyPair, deriveGenericSigningKeyPair } from 'redux_state/key-derivation'
import router from './router'
import Mnemonic from 'bitcore-mnemonic'

const NEXT_ROUTES = {
  '/registration': '/registration/entropy',
  '/registration/entropy': '/registration/write-phrase'
}

export const actions = makeActions('registration', {
  goForward: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        const state = getState()
        if (state.getIn(['registration', 'complete'])) {
          dispatch(actions.registerWallet())
        } else {
          let nextURL = helpers._getNextURLfromState(state)
          dispatch(router.pushRoute(nextURL))
        }
      }
    }
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
        }
      }
    }
  },
  submitEntropy: {
    expectedParams: [],
    creator: () => {
      return (dispatch, getState) => {
        const entropyState = getState().getIn([
          'registration',
          'passphrase',
          'sufficientEntropy'
        ])

        if (entropyState) {
          return dispatch(actions.generateKeyPairs())
        }

        throw new Error('Not enough entropy!')
      }
    }
  },
  generateKeyPairs: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const randomStringState = getState().getIn([
          'registration',
          'passphrase',
          'randomString'
        ])

        if (randomStringState === '') {
          return
        }
        // eslint-disable-next-line max-len
        dispatch(actions.generateKeyPairs.buildAction(params, async () => {
          // why does this only function as an async?
          const entropy = services.entropy
          let seed = new Mnemonic(entropy.getHashedEntropy(randomStringState), Mnemonic.Words.ENGLISH)
          let masterKeyPair = deriveMasterKeyPair(seed)
          // TODO: Save masterKeyPair
          let genericSigningKey = deriveGenericSigningKeyPair(masterKeyPair)
          dispatch(actions.setPassphrase(seed.phrase))
          dispatch(actions.goForward())
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
  setUsername: {
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
    creator: params => {
      return (dispatch, getState) => {
        const state = getState().get('registration').toJS()
        dispatch(actions.checkCredentials.buildAction(params, (backend) => {
          return backend.gateway
            .checkUserDoesNotExist({userName: state.username.value})
            .then(params => {
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
          await services.auth.register({
            userName: state.username.value,
            seedPhrase: state.passphrase.phrase,
            inviteCode: state.inviteCode,
            gatewayUrl: state.ownURL.valueOwnURL
          })
          await services.auth.login({
            seedPhrase: state.passphrase.phrase,
            gatewayUrl: state.ownURL.valueOwnURL
          })
          dispatch(router.pushRoute('/wallet'))
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
  ownURL: {
    hasOwnURL: false,
    errorMsg: '',
    valueOwnURL: ''
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

export default (state = initialState, action = {}) => {
  state = state.set('complete', helpers._isComplete(state))

  switch (action.type) {

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

    case actions.generateKeyPairs.id:
      return state.mergeDeep({
        passphrase: {
          generating: true,
          generated: false,
          errorMsg: null
        }
      })

    case actions.generateKeyPairs.id_fail:
      return state.mergeDeep({
        passphrase: {
          generating: false,
          generated: false,
          errorMsg: 'generating passphrase has failed'
        }
      })

    case actions.generateKeyPairs.id_success:
      return state.mergeDeep({
        passphrase: {
          generating: false,
          generated: true,
          errorMsg: null
        }
      })

    case actions.setMaskedImageUncovering.id:
      return state.setIn(['maskedImage', 'uncovering'], action.value)

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

    // case actions.setInviteCode.id:
    //   return state.merge({
    //     inviteCode: action.code
    //   })

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

export const helpers = {
  _isComplete: (state) => {
    const isFieldValid = (fieldName) => state.getIn([fieldName, 'valid'])
    const areFieldsValid = (fields) => every(fields, isFieldValid)
    return areFieldsValid(['username', 'passphrase'])
  },
  _getNextURLfromState: (state) => {
    const currentPath = state.get('routing').locationBeforeTransitions.pathname
    return NEXT_ROUTES[currentPath]
  }
}
