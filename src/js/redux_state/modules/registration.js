import every from 'lodash/every'
import Immutable from 'immutable'
import * as cryptoUtils from 'lib/crypto'
import { makeActions } from './'
import router from './router'
const NEXT_ROUTES = {
  '/registration': '/registration/entry-password',
  '/registration/entry-password': '/registration/write-phrase'
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

  setRandomString: {
    expectedParams: ['randomString']
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
          return dispatch(actions.setRandomString({
            randomString: entropy.getRandomString(4)
          }))
        }
      }
    }
  },

  generateAndEncryptKeyPairs: {
    expectedParams: [],
    async: true,
    creator: () => {
      return async (dispatch, getState, {services, backend}) => {
        const randomString = getState().getIn([
          'registration',
          'passphrase',
          'randomString'
        ])

        const password = getState().getIn([
          'registration',
          'encryption',
          'pass'
        ])

        if (!randomString) {
          // TODO consistent error handling
          throw new Error('No random string provided')
        }

        const {
          didDocument,
          mnemonic,
          masterKeyWIF,
          genericSigningKeyWIF,
          ethereumKeyWIF
        } = backend.jolocomLib.identity.create(randomString)

        const {privateKey, address} = cryptoUtils.decodeWIF(ethereumKeyWIF)

        try {
          await backend.ethereum.requestEther({ did: didDocument.did, address })
        } catch (err) {
          // TODO consistent error handling
          throw new Error(err)
        }

        // TODO consistent error handling
        const ddoHash = await backend.jolocomLib.identity.store(didDocument)

        try {
          await backend.jolocomLib.identity.register(
            Buffer.from(privateKey, 'hex'),
            didDocument.id,
            ddoHash
          )
        } catch (err) {
          throw new Error(err)
          // TODO consistent error handling
        }

        const encMaster = await backend.encryption.encryptInformation({
          password,
          data: masterKeyWIF
        })

        const encGeneric = await backend.encryption.encryptInformation({
          password,
          data: genericSigningKeyWIF
        })

        await services.storage.setItem('masterKeyWIF', encMaster)
        await services.storage.setItem('genericKeyWIF', encGeneric)

        dispatch(actions.setRandomString({randomString: ''}))
        dispatch(actions.setPassphrase({mnemonic}))
        // dispatch(actions.goForward())
      }
    }
  },

  publishDDO: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return async (dispatch, getState, {services, backend}) => {
      }
    }
  },

  // TODO Check
  setDID: {
    expectedParams: ['DID']
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
