import every from 'lodash/every'
import Immutable from 'immutable'
import { makeActions } from './'
import bitcoin from 'bitcoinjs-lib'
import bitMessage from 'bitcoinjs-message'
import bip39 from 'bip39'
import {
  deriveMasterKeyPair,
  deriveGenericSigningKeyPair
} from 'lib/key-derivation'
import router from './router'
import StorageManager from 'lib/storage'
const NEXT_ROUTES = {
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
          const randomString = entropy.getRandomString(6)
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
        dispatch(actions.generateKeyPairs())
      }
    }
  },

  generateKeyPairs: {
    expectedParams: [],
    async: false,
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
        // TODO: Save masterKeyPair
        const masterKeyPair = deriveMasterKeyPair(seedphrase)
        // eslint-disable-next-line
        const genericSigningKey = deriveGenericSigningKeyPair(masterKeyPair)
        // console.log(genericSigningKey.parentFingerprint, masterKeyPair.getFingerprint())

        const wif = genericSigningKey.keyPair.toWIF()
        const key = bitcoin.ECPair.fromWIF(wif)

        const address = key.getAddress()
        const keyPair = bitcoin.ECPair.fromWIF(wif)
        const privateKey = keyPair.d.toBuffer(32)
        const message = 'This is an example of a signed message.'
        // eslint-disable-next-line
        const signature = bitMessage.sign(message, privateKey, keyPair.compressed)
        
        console.log(signature.toString('base64'))
        console.log(bitMessage.verify(message, address, signature))

        // At later points, retrieve it and generate Key based on that
        // Use the generated key

        // backend.encryption.encryptInformation({password: 'bla', data: seed.phrase}).then((res) => {
        //   // TODO Cordova stringify?
        //   StorageManager.setItem('masterSeed', JSON.stringify(res.crypto))
          /*
          backend.encryption.decryptInformation({
            ciphertext: res.crypto.ciphertext,
            password: 'bla',
            salt: res.crypto.kdfParams.salt,
            iv: res.crypto.cipherparams.iv
          }).then(output => {
            dispatch(actions.setPassphrase({phrase: seed.phrase}))
            dispatch(actions.goForward())
          })
          */
        // })
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
