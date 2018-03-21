import Immutable from 'immutable'
import {makeActions} from '../'

export const actions = makeActions('keystore/security', {
  checkPassword: {
    expectedParams: ['value', 'key']
  },
  encryptDataWithPassword: {
    expectedParams: ['data'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        const pass = getState().toJS().keystore.security.pass
        dispatch(actions.encryptDataWithPassword.buildAction(params, () => {
          return backend.encryption.encryptInformation({
            password: pass,
            data: 'testingoutfunfunfun' // master key needs to be passed in
          })
          .then((result) => {
            return services.storage.setItem('userData', JSON.stringify(result))
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
        const pass = getState().toJS().keystore.security.pass
        dispatch(actions.decryptDataWithPassword.buildAction(params, async () => { // eslint-disable-line max-len
          const result = await services.storage.getItem('userData')
          const userData = JSON.parse(result)
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
  pass: '',
  passReenter: '',
  errorMsg: '',
  status: ''
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

    case actions.encryptDataWithPassword.id:
      return state.mergeDeep({
        loading: true,
        status: ''
      })

    case actions.encryptDataWithPassword.id_success:
    // here crypto object (JSON) is returned in action.result
      return state.mergeDeep({
        loading: false,
        status: 'OK'
      })

    case actions.encryptDataWithPassword.id_fail:
      return state.mergeDeep({
        errorMsg: action.error,
        loading: false
      })

    case actions.decryptDataWithPassword.id:
      return state.mergeDeep({
        loading: true,
        status: ''
      })

    case actions.decryptDataWithPassword.id_success:
      // here plaintext message is returned in action.result
      return state.mergeDeep({
        loading: false,
        status: 'OK'
      })

    case actions.decryptDataWithPassword.id_fail:
      return state.mergeDeep({
        errorMsg: action.error,
        loading: false
      })

    default:
      return state
  }
}
