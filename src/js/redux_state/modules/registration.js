import every from 'lodash/every'
import Immutable from 'immutable'
import { makeActions } from './'
import {
  deriveMasterKeyPair,
  deriveGenericSigningKeyPair
} from 'lib/key-derivation'
import router from './router'
import StorageManager from 'lib/storage'
import Mnemonic from 'bitcore-mnemonic'

const NEXT_ROUTES = {
  '/registration': '/registration/write-phrase',
  '/registration/write-phrase': '/registration/entry-password'
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
        if (getState().getIn(['registration', 'passphrase', 'phrase'])) {
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
          dispatch(actions.setRandomString({randomString}))
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

        if (!entropyState) {
          throw new Error('Not enough entropy!')
        }

        return dispatch(actions.generateKeyPairs())
      }
    }
  },
  generateKeyPairs: {
    expectedParams: [],
    async: false,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const randomStringState = getState().getIn([
          'registration',
          'passphrase',
          'randomString'
        ])

        if (!randomStringState) {
          throw new Error('No seedphrase found.')
        }

        const hashedEnt = services.entropy.getHashedEntropy(randomStringState)
        const seed = new Mnemonic(hashedEnt, Mnemonic.Words.ENGLISH)

        // TODO: Save masterKeyPair
        const masterKeyPair = deriveMasterKeyPair(seed)
        // eslint-disable-next-line
        const genericSigningKey = deriveGenericSigningKeyPair(masterKeyPair)

        dispatch(actions.setPassphrase({phrase: seed.phrase}))
        dispatch(actions.goForward())
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
  encryptDataWithPasswordOnRegister: {
    expectedParams: ['data'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        const pass = getState().toJS().registration.encryption.pass
        dispatch(actions.encryptDataWithPasswordOnRegister.buildAction(params, () => { // eslint-disable-line max-len
          return backend.encryption.encryptInformation({
            password: pass,
            data: 'testingoutfunfunfun' // master key needs to be passed in
          })
          .then((result) => {
            StorageManager.setItem('userData', JSON.stringify(result))
            dispatch(router.pushRoute('/wallet'))
          })
        }))
      }
    }
  },
  checkPassword: {
    expectedParams: ['password', 'fieldName']
  }
})

const initialState = Immutable.fromJS({
  maskedImage: {
    uncovering: false
  },
  passphrase: {
    sufficientEntropy: false,
    progress: 0,
    randomString: '',
    phrase: '',
    writtenDown: false,
    valid: false
  },
  encryption: {
    loading: false,
    pass: '',
    passReenter: '',
    errorMsg: '',
    status: ''
  },
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

    case actions.setMaskedImageUncovering.id:
      return state.setIn(['maskedImage', 'uncovering'], action.value)

    case actions.setPassphraseWrittenDown.id:
      state = state.mergeDeep({
        passphrase: {
          writtenDown: action.value,
          valid: !!state.getIn(['passphrase', 'phrase']) && action.value
        }
      })

      return state.set('complete', helpers._isComplete(state))

    case actions.encryptDataWithPasswordOnRegister.id:
      return state.mergeDeep({
        encryption: {
          loading: true,
          status: ''
        }
      })

    case actions.encryptDataWithPasswordOnRegister.id_success:
    // here crypto object (JSON) is returned in action.result
      return state.mergeDeep({
        encryption: {
          loading: false,
          status: 'OK'
        }
      })

    case actions.encryptDataWithPasswordOnRegister.id_fail:
      return state.mergeDeep({
        encryption: {
          errorMsg: action.error,
          loading: false
        }
      })

    case actions.checkPassword.id:
      if (action.fieldName === 'pass') {
        return state.mergeDeep({
          encryption: {pass: action.password}
        })
      } else if (action.fieldName === 'passReenter') {
        return state.mergeDeep({
          encryption: {passReenter: action.password}
        })
      }
      return state

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
