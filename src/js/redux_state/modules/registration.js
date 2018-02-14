import every from 'lodash/every'
import Immutable from 'immutable'
import * as cryptoUtils from 'lib/crypto'
import { makeActions } from './'
import { actions as accountActions } from './account'
import router from './router'
const NEXT_ROUTES = {
  '/registration': '/registration/entry-password',
  '/registration/entry-password': '/registration/write-phrase',
  '/registration/write-phrase': '/wallet'
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

  startLoading: {
    expectedParams: []
  },

  stopLoading: {
    expectedParams: []
  },

  setLoadingMsg: {
    expectedParams: ['loadingMsg']
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
        dispatch(actions.startLoading())

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

        dispatch(actions.setLoadingMsg({loadingMsg: 'Generating keys'}))

        const {
          didDocument,
          mnemonic,
          masterKeyWIF,
          genericSigningKeyWIF,
          ethereumKeyWIF
        } = backend.jolocomLib.identity.create(randomString)
        const {privateKey, address} = cryptoUtils.decodeWIF(ethereumKeyWIF)

        dispatch(actions.setLoadingMsg({loadingMsg: 'Fueling with Ether'}))

        try {
          await backend.ethereum.requestEther({ did: didDocument.did, address })
        } catch (err) {
          // TODO consistent error handling
          throw new Error(err)
        }

        dispatch(actions.setLoadingMsg({loadingMsg: 'Storing data on IPFS'}))

        // TODO consistent error handling
        const ddoHash = await backend.jolocomLib.identity.store(didDocument)

        dispatch(actions.setLoadingMsg({
          loadingMsg: 'Registering identity on Ethereum'
        }))

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

        dispatch(actions.setLoadingMsg({
          loadingMsg: 'Encrypting and storing data on device'
        }))

        const encMaster = await backend.encryption.encryptInformation({
          password,
          data: masterKeyWIF
        })

        const encGeneric = await backend.encryption.encryptInformation({
          password,
          data: genericSigningKeyWIF
        })

        await services.storage.setItem('did', didDocument.id)
        await services.storage.setItem('masterKeyWIF', encMaster)
        await services.storage.setItem('genericKeyWIF', encGeneric)

        try {
          await services.storage.setItemSecure('encryptionPassword', password)
        } catch(err) {
          await services.storage.setItem('tempGenericKeyWIF', genericSigningKeyWIF) // eslint-disable-line max-len
        }

        dispatch(actions.setRandomString({randomString: ''}))
        dispatch(actions.setPassword({password: ''}))
        dispatch(actions.setReentryPassword({password: ''}))

        dispatch(accountActions.setDID({did: didDocument.id}))
        dispatch(actions.setPassphrase({mnemonic}))
        dispatch(actions.stopLoading())
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

  setPassphraseWrittenDown: {
    expectedParams: ['value']
  },

  setPassword: {
    expectedParams: ['password']
  },

  setReentryPassword: {
    expectedParams: ['password']
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
  progress: {
    loading: false,
    loadingMsg: ''
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

    case actions.setLoadingMsg.id:
      return state.setIn(['progress', 'loadingMsg'], action.loadingMsg)

    case actions.startLoading.id:
      return state.setIn(['progress', 'loading'], true)

    case actions.stopLoading.id:
      return state.setIn(['progress', 'loading'], false)

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

    case actions.setPassword.id:
      return state.setIn(['encryption', 'pass'], action.password)

    case actions.setReentryPassword.id:
      return state.setIn(['encryption', 'passReenter'], action.password)

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
