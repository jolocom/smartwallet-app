import {expect} from 'chai'
import { actions } from './security'
const reducer = require('./security').default

describe('# Security redux module', () => {
  describe('# Reducer', () => {
    it('should initialize properly', () => {
      const state = reducer(undefined, '@@INIT')

      expect(state.toJS()).to.deep.equal({
        loading: false,
        pass: '',
        passReenter: '',
        errorMsg: '',
        status: ''
      })
    })

    it('should update correct state based on key (pass/passReenter)', () => {
      let state = reducer(undefined, '@@INIT')

      const actionCheckPassword = {
        type: actions.checkPassword.id,
        key: 'passReenter',
        value: 'testPasswordNatascha1'
      }
      state = reducer(state, actionCheckPassword)
      const expectedState = {
        loading: false,
        pass: '',
        passReenter: 'testPasswordNatascha1',
        errorMsg: '',
        status: ''
      }
      expect(state.toJS()).to.deep.equal(expectedState)
    })

    it('should encrypt information and return status OK', () => {
      let state = reducer(undefined, '@@INIT')

      const actionCheckPassword = {
        type: actions.checkPassword.id,
        key: 'pass',
        value: 'testPasswordNatascha1'
      }

      state = reducer(state, actionCheckPassword)

      const actionEncryptDataWithPassword = {
        type: actions.encryptDataWithPassword.id_success,
        result: 'test'
      }
      state = reducer(state, actionEncryptDataWithPassword)
      const expectedState = {
        loading: false,
        pass: 'testPasswordNatascha1',
        passReenter: '',
        errorMsg: '',
        status: 'OK'
      }
      expect(state.toJS()).to.deep.equal(expectedState)
    })

    it('should decrypt infromation and return status OK', () => {
      let state = reducer(undefined, '@@INIT')

      const actionCheckPassword = {
        type: actions.checkPassword.id,
        key: 'pass',
        value: 'testPasswordNatascha1'
      }

      state = reducer(state, actionCheckPassword)

      const actionDecryptDataWithPassword = {
        type: actions.encryptDataWithPassword.id_success,
        result: 'test'
      }
      state = reducer(state, actionDecryptDataWithPassword)
      const expectedState = {
        loading: false,
        pass: 'testPasswordNatascha1',
        passReenter: '',
        errorMsg: '',
        status: 'OK'
      }
      expect(state.toJS()).to.deep.equal(expectedState)
    })
  })
})
