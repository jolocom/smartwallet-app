import every from 'lodash/every'
import Immutable from 'immutable'
import { makeActions } from './'
import bip39 from 'bip39'
import {
  deriveMasterKeyPairFromSeedphrase,
  deriveGenericSigningKeyPair
} from 'lib/key-derivation'
import router from './router'
import StorageManager from 'lib/storage'
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
        let nextURL = helpers._getNextURLfromState(state)
        dispatch(router.pushRoute(nextURL))
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
          const randomString = entropy.getRandomString(4)
          return dispatch(actions.submitEntropy(randomString))
        }
      }
    }
  },
  submitEntropy: {
    expectedParams: ['randomString'],
    creator: (randomString) => {
      return (dispatch, getState) => {
        const entropyState = getState().getIn([
          'registration',
          'passphrase',
          'sufficientEntropy'
        ])

        if (!entropyState) {
          throw new Error('Not enough entropy!')
        }
        dispatch(actions.generateSeedPhrase(randomString))
      }
    }
  },

  generateSeedPhrase: {
    expectedParams: ['randomString'],
    creator: (randomString) => {
      return (dispatch, getState) => {
        const mnemonic = bip39.entropyToMnemonic(randomString)
        dispatch(actions.setPassphrase({mnemonic}))
      }
    }
  },

  generateAndEncryptKeyPairs: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {

        const seedphrase = getState().getIn([
          'registration',
          'passphrase',
          'phrase'
        ])
        if (!seedphrase) {
          throw new Error('No seedphrase found.')
        }
        const masterKeyPair = deriveMasterKeyPairFromSeedphrase(seedphrase)
        const genericSigningKey = deriveGenericSigningKeyPair(masterKeyPair)
        console.log(genericSigningKey, 'generic')
        console.log(masterKeyPair, 'master')

        dispatch(actions.generateAndEncryptKeyPairs.buildAction(params, async() => { // eslint-disable-line max-len
          dispatch(actions.encryptDataWithPasswordOnRegister(masterKeyPair)
          .then((result) => {
            console.log('inside master')
            StorageManager.setItem('masterKeyPair', JSON.stringify(result))
          }))
  
          dispatch(actions.encryptDataWithPasswordOnRegister(genericSigningKey)
          .then((result) => {
            console.log('inside generic')
            StorageManager.setItem('genericSigningKey', JSON.stringify(result))
          }))
        }))
        // dispatch(router.pushRoute('/wallet'))
      }
    }
  },

  setEntropyStatus: {
    expectedParams: ['sufficientEntropy', 'progress']
  },
  setPassphrase: {
    expectedParams: ['phrase']
  },
  setPassphraseWrittenDown: {
    expectedParams: ['value']
  },
  encryptDataWithPasswordOnRegister: {
    expectedParams: ['data'],
    async: true,
<<<<<<< HEAD
=======
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
>>>>>>> removed unused libraries
    creator: (data) => {
      return (dispatch, getState, {backend, services}) => {
        const pass = getState().toJS().registration.encryption.pass
        dispatch(actions.encryptDataWithPasswordOnRegister.buildAction(data, () => { // eslint-disable-line max-len
          console.log('inside encrypt')
          return backend.encryption.encryptInformation({
            password: pass,
            data: data
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
    phrase: '',
    writtenDown: false,
    valid: false
  },
  encryption: {
    generatedAndEncrypted: false,
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

    case actions.setPassphrase.id:
      return state.mergeIn(['passphrase'], {
        phrase: action.mnemonic
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
    
    case actions.generateAndEncryptKeyPairs.id:
      return state.mergeDeep({
        encryption: {
          generatedAndEncrypted: false,
          status: ''
        }
    })

    case actions.generateAndEncryptKeyPairs.id_success:
    return state.mergeDeep({
      encryption: {
        generatedAndEncrypted: true,
        status: ''
      }
  })

      case actions.generateAndEncryptKeyPairs.id_fail:
      return state.mergeDeep({
        encryption: {
          generatedAndEncrypted: false,
          status: ''
        }
    })

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

    return areFieldsValid(['passphrase'])
  },
  _getNextURLfromState: (state) => {
    const currentPath = state.get('routing').locationBeforeTransitions.pathname
    return NEXT_ROUTES[currentPath]
  }
}
