import {expect} from 'chai'
import Immutable from 'immutable'
import * as login from './wallet-login'
// import * as router from './router'
import {stub} from '../../../../test/utils'
const reducer = require('./wallet-login').default

describe.only('Wallet login Redux module', function() {
  describe('setUserType', function() {
    it('should throw an error when supplying invalid value', () => {
      const thunk = login.actions.setUserType('bla')
      expect(() => thunk(stub(), stub().returns({
        get: () => ({toJS: () => ({userType: {valid: false, value: 'bla'}})})
      }))).to.throw('Invalid user type: bla')
    })

    it('should be able to set the user type to a valid value', () => {
      let state = reducer(undefined, '@@INIT')

      state = reducer(state, login.actions.setUserType('expert'))

      expect(state.get('userType').toJS())
        .to.deep.equal({value: 'expert', valid: true})

      state = reducer(state, login.actions.setUserType('layman'))
      expect(state.get('userType').toJS())
        .to.deep.equal({value: 'layman', valid: true})
    })
  })
  describe('setPassphrase', () => {
    it('should return the correct value', () => {
      const action = login.actions.setPassphrase('test')
      expect(action.value).to.equal('test')
    })
  })
  describe('resetPassphrase', () => {
    it('should return the correct value', () => {
      const action = login.actions.resetPassphrase()
      expect(action.value).to.be.empty
    })
  })
  describe('setPin', () => {
    it('should return the correct value', () => {
      const action = login.actions.setPin('0000')
      expect(action.value).to.equal('0000')
    })
  })
  describe('resetPin', () => {
    it('should return the correct value', () => {
      const action = login.actions.resetPin()
      expect(action.value).to.be.empty
    })
  })
  describe('setPinFocused', () => {
    it('should update the pin value in the state', () => {
      const action = login.actions.setPinFocused(true)
      expect(action.value).to.be.true
    })
  })
  describe('setUsername', () => {
    it('should return the correct value', () => {
      const action = login.actions.setUsername('test')
      expect(action.value).to.equal('test')
    })
  })
  describe('setPassword', () => {
    it('should return the correct value', () => {
      const action = login.actions.setPassword('test')
      expect(action.value).to.equal('test')
    })
  })
  describe('submitLogin', () => {
    it('should return the correct value', () => {
      const action = login.actions.submitLogin({
        username: 'test',
        password: 'test'
      })
      expect(action.value).to.equal('test')
    })
  })
  describe('#Reducer', () => {
    it('should initialize properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
        userType: {value: '', valid: false},
        passphrase: {value: '', failed: false, valid: false, errorMsg: ''},
        pin: {value: '', failed: false, valid: false, focused: false,
          errorMsg: ''
        },
        login: {
          username: '',
          password: '',
          errorMsg: '',
          failed: false,
          valid: false
        }
      })
    })
    it('should not modify the state if an unknown action is dispatched', () => {
      const oldState = reducer(undefined, '@@INIT')
      const newState = reducer(oldState, {
        type: 'an unknown action'
      })
      expect(newState).to.deep.equal(oldState)
    })
    describe('#setPin', () => {
      it('should be able to set the pin value to a valid value', () => {
        const state = reducer(undefined, '@@INIT')
        const newState = reducer(state, login.actions.setPin('0000'))
        expect(newState.toJS().pin.value).to.equal('0000')
        expect(newState.toJS().pin.valid).to.be.true
      })
      it('should not set the pin value to a non valid value', () => {
        const state = reducer(undefined, login.actions.setPin('00'))
        const newState = reducer(state, login.actions.setPin('00e'))
        expect(newState.toJS().pin.value).to.equal('00')
        expect(newState.toJS().pin.valid).to.be.false
      })
    })
    describe('#resetPin', () => {
      it('should set the passphrase attributes to their initial values', () => {
        const state = reducer(undefined, '@@INIT')
        const newState = reducer(state, login.actions.resetPin())
        expect(newState.toJS().pin).to.deep.equal({
          value: '', focused: false, failed: false, valid: false, errorMsg: ''
        })
      })
    })
    describe('#setPinFocused', () => {
      it('should set the passphrase attributes to their initial values', () => {
        const state = reducer(undefined, '@@INIT')
        const newState = reducer(state, login.actions.setPinFocused(true))
        expect(newState.toJS().pin.focused).to.be.true
      })
    })
    describe('#setPassphrase', () => {
      it('should be able to set the passphrase value to a valid value', () => {
        const state = reducer(undefined, '@@INIT')
        const newState = reducer(state, login.actions.setPassphrase('Test'))
        expect(newState.toJS().passphrase.value).to.equal('Test')
        expect(newState.toJS().passphrase.valid).to.be.true
      })
    })
    describe('#submitPassphrase', () => {
      it('should return an error message if the passphrase is not correct',
        () => {
          const state = reducer(undefined, '@@INIT')
          const newState = reducer(state, {
            type: login.actions.submitPassphrase.id_fail,
            error: new Error('test')
          })
          expect(newState.toJS().passphrase.errorMsg)
            .to.equal('Your passphrase is not correct')
          expect(newState.toJS().passphrase.valid).to.be.false
          expect(newState.toJS().passphrase.failed).to.be.true
        }
      )
      it('should update passphrase attributes when submit succeed', () => {
        const state = reducer(undefined, login.actions.setPassphrase('test'))
        const newState = reducer(state, {
          type: login.actions.submitPassphrase.success
        })
        expect(newState.toJS().passphrase.errorMsg).to.equal('')
        expect(newState.toJS().passphrase.valid).to.be.true
        expect(newState.toJS().passphrase.failed).to.be.false
      })
    })
    describe('#goForward', () => {
      it('should update passphrase and pin attributes when goForward succeed',
        () => {
          const phraseState = reducer(
            undefined,
            login.actions.setPassphrase('test')
          )
          const state = reducer(phraseState, login.actions.setPin('0000'))
          const newState = reducer(state, {
            type: login.actions.goForward.success
          })
          expect(newState.toJS().passphrase.errorMsg).to.equal('')
          expect(newState.toJS().passphrase.valid).to.be.true
          expect(newState.toJS().passphrase.failed).to.be.false
          expect(newState.toJS().pin.errorMsg).to.equal('')
          expect(newState.toJS().pin.valid).to.be.true
          expect(newState.toJS().pin.failed).to.be.false
        }
      )
      it('should update passphrase and pin attributes when goForward fails',
      () => {
        const state = reducer(undefined, '@@INIT')
        const newState = reducer(state, {
          type: login.actions.goForward.id_fail,
          error: new Error('test')
        })
        expect(newState.toJS().pin.errorMsg)
        .to.equal('Your Pin is Not correct!')
        expect(newState.toJS().pin.valid).to.be.false
        expect(newState.toJS().pin.failed).to.be.true
      })
    })
    describe('goToLogin', () => {
      it('should redirect the user to the login screen', function() {
        const dispatch = stub()
        const thunk = login.actions.goToLogin()
        thunk(dispatch)
        expect(dispatch.called).to.be.true
        expect(dispatch.calls).to.deep.equal([{
          args: [{
            payload: {
              args: ['/login'],
              method: 'push'
            },
            type: '@@router/CALL_HISTORY_METHOD'
          }]
        }])
      })
    })
    describe('#resetPassphrase', () => {
      it('should set the passphrase value in the state to empty string', () => {
        const resetPassphrase = login.actions.resetPassphrase
        const state = Immutable.fromJS({passphrase: {
          value: 'test'
        }})
        const newState = reducer(state, resetPassphrase())
        expect(newState.toJS().passphrase.value).to.equal('')
      })
    })
  })
})
