import {expect} from 'chai'
import { actions } from './keystorage'
import {stub} from '../../../../../test/utils'
const reducer = require('./keystorage').default

// which tests seem logical?
// checkPassword
// encryptDataWithPassword
// decryptDataWithPassword

describe.only('# Keystorage redux module', () => {
  describe('# Reducer', () => {
    // is this super important
    it('should initialize properly', () => {
      const state = reducer(undefined, '@@INIT')
      // -> this is how I can get the state for the respective reducer

      expect(state.toJS()).to.deep.equal({
        loading: false,
        pass: '',
        passReenter: '',
        errorMsg: ''
      })
    })

    // it('should decrypt information and return ciphertext', () => {
    //   let state = reducer(undefined, '@@INIT')
    //   // set the password in state
    //   const actionCheckPassword = {
    //     type: actions.checkPassword.id,
    //     key: 'pass',
    //     value: 'testPasswordNatascha1'
    //   }
    //
    //   state = reducer(state, actionCheckPassword)
    //   console.log('STATE AFTER ACTION: ', state)
    //   const password = state.toJS().pass
    //   const actionencryptDataWithPassword = {
    //     type: actions.encryptDataWithPassword.id_success,
    //     result: 'xx'
    //   }
    //   state = reducer(state, actionencryptDataWithPassword)
    //   console.log('STATE AFTER ENCRYPT: ', state)
    // })
  })
})
