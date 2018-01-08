import Immutable from 'immutable'
import {makeActions} from '../'

export const actions = makeActions('keystore/keystorage', {
  checkPassword: {
    expectedParams: ['value', 'key']
  },
  enryptDataWithPassword: {
    expectedParams: ['data'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        const pass = getState().toJS().keystore.keyStorage.pass
        dispatch(actions.enryptDataWithPassword.buildAction(params, () => {
          return backend.encryption.encryptInformation({
            password: pass,
            data: 'testingoutfunfunfun' // master key needs to be passed in
          })
        }))
      }
    }
  },
  decryptDataWithPassword: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        const pass = getState().toJS().keystore.keyStorage.pass
        dispatch(actions.decryptDataWithPassword.buildAction(params, () => {
          const userData = JSON.parse(window.localStorage.getItem('userData'))
          return backend.encryption.decryptInformation({
            ciphertext: userData.crypto.ciphertext,
            password: pass,
            salt: userData.crypto.kdfParams.salt,
            iv: userData.crypto.cipherparams.iv
          })
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  loading: false,
  message: 'testEncryptMessage',
  pass: '',
  passReenter: '',
  errorMsg: ''
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.checkPassword.id:
      if (action.key === 'pass') {
        return state.mergeDeep({
          pass: action.value
        })
      } else if (action.key === 'passReenter') {
        return state.mergeDeep({
          passReenter: action.value
        })
      }
      return state

    case actions.enryptDataWithPassword.id:
      return state.mergeDeep({
        loading: true
      })

    case actions.enryptDataWithPassword.id_success:
      window.localStorage.setItem('userData', JSON.stringify(action.result))
      return state.mergeDeep({
        loading: false
      })

    case actions.enryptDataWithPassword.id_fail:
      return state.mergeDeep({
        errorMsg: action.error,
        loading: false
      })

    case actions.decryptDataWithPassword.id:
      return state.mergeDeep({
        loading: true
      })

    case actions.decryptDataWithPassword.id_success:
      console.log('decryptDataWithPassword REDUCER: ', action)
      return state.mergeDeep({
        loading: false
      })

    case actions.decryptDataWithPassword.id_fail:
      console.log('decryptDataWithPassword REDUCER: ', action.error)
      return state.mergeDeep({
        errorMsg: action.error,
        loading: false
      })

    default:
      return state
  }
}
