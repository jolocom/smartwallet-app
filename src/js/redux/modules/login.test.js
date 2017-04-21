import {expect} from 'chai'
import Immutable from 'immutable'
import * as login from './login'
import * as router from './router'
import {stub, withStubs} from '../../../../test/utils'
const reducer = require('./login').default

describe('Wallet login Redux module', function() {
  describe('setPassphrase', () => {
    it('should update the passphrase value in the state', () => {
      const setPassphrase = login.actions.setPassphrase
      const state = Immutable.fromJS({passphrase: {
        value: ''
      }})
      const newState = reducer(state, setPassphrase('test'))
      expect(newState.toJS().passphrase.value).to.equal('test')
    })
  })
  describe('resetPassphrase', () => {
    it('should set the passphrase value in the state to empty string', () => {
      const resetPassphrase = login.actions.resetPassphrase
      const state = Immutable.fromJS({passphrase: {
        value: 'test'
      }})
      const newState = reducer(state, resetPassphrase())
      expect(newState.toJS().passphrase.value).to.equal('')
    })
  })
  describe('setPin', () => {
    it('should update the pin value in the state', () => {
      const setPin = login.actions.setPin
      const state = Immutable.fromJS({pin: {
        value: ''
      }})
      const newState = reducer(state, setPin('0000'))
      expect(newState.toJS().pin.value).to.equal('0000')
    })
  })
  describe('resetPin', () => {
    it('should set the pin value in the state to empty string', () => {
      const resetPassphrase = login.actions.resetPin
      const state = Immutable.fromJS({pin: {
        value: '0000'
      }})
      const newState = reducer(state, resetPassphrase())
      expect(newState.toJS().pin.value).to.equal('')
    })
  })
  describe('setPinFocused', () => {
    it('should update the pin value in the state', () => {
      const setPinFocused = login.actions.setPinFocused
      const state = Immutable.fromJS({pin: {
        focused: false
      }})
      const newState = reducer(state, setPinFocused(true))
      expect(newState.toJS().pin.focused).to.be.true
    })
  })
  describe('#Reducer', () => {
    describe('setPin', () => {
      it('should initialize proporly', () => {
        const state = reducer(undefined, '@@INIT')
        expect(state.toJS()).to.deep.equal({
          passphrase: {value: '', failed: false, valid: false},
          pin: {value: '', focused: false, failed: false, valid: false}
        })
      })
      it('should be able to set the pin value to a valid value', () => {
        const state = reducer(undefined, '@@INIT')
        const newState = reducer(state, login.actions.setPin('0000'))
        expect(newState.toJS().pin.value).to.equal('0000')
      })
    })
  })
})
