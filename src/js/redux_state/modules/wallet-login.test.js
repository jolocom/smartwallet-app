import {expect} from 'chai'
import Immutable from 'immutable'
import { actions } from './wallet-login'
import {stub} from '../../../../test/utils'
const reducer = require('./wallet-login').default

describe('Wallet login Redux module', function() {
  describe('setPassphrase', () => {
    it('should return the correct value', () => {
      const action = actions.setPassphrase('test')
      expect(action.value).to.equal('test')
    })
  })
  describe('resetPassphrase', () => {
    it('should return the correct value', () => {
      const action = actions.resetPassphrase()
      expect(action.value).to.be.empty
    })
  })
  describe('#Reducer', () => {
    it('should initialize properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
        passphrase: {value: '', failed: false, valid: false, errorMsg: '',
          hasOwnURL: false, valueOwnURL: ''},
        login: {
          errorMsg: null,
          failed: false,
          valid: false
        },
        callbackURL: ''
      })
    })
    it('should not modify the state if an unknown action is dispatched', () => {
      const oldState = reducer(undefined, '@@INIT')
      const newState = reducer(oldState, {
        type: 'an unknown action'
      })

      expect(newState).to.deep.equal(oldState)
    })
    describe('#setPassphrase', () => {
      it('should be able to set the passphrase value to a valid value', () => {
        const state = reducer(undefined, '@@INIT')
        const newState = reducer(state, actions.setPassphrase('Test'))
        expect(newState.toJS().passphrase.value).to.equal('Test')
        expect(newState.toJS().passphrase.valid).to.be.true
      })
    })
    describe('#goForward', () => {
      it('should update passphrase attributes when goForward succeed',
        () => {
          const phraseState = reducer(
            undefined,
            actions.setPassphrase('test')
          )
          const newState = reducer(phraseState, {
            type: actions.goForward.success
          })
          expect(newState.toJS().passphrase.errorMsg).to.equal('')
          expect(newState.toJS().passphrase.valid).to.be.true
          expect(newState.toJS().passphrase.failed).to.be.false
        }
      )
      it('should update passphrase attributes when goForward fails',
      () => {
        const state = reducer(undefined, '@@INIT')
        const newState = reducer(state, {
          type: actions.goForward.id_fail,
          error: new Error('test')
        })
        expect(newState.toJS().login.errorMsg)
        .to.equal('Address for your private space cannot be reached. Please double check.') // eslint-disable-line max-len
        expect(newState.toJS().login.valid).to.be.false
        expect(newState.toJS().login.failed).to.be.true
      })
    })
    describe('goToLogin', () => {
      it('should redirect the user to the login screen', function() {
        const dispatch = stub()
        const thunk = actions.goToLogin()
        thunk(dispatch)
        expect(dispatch.called).to.be.true
        expect(dispatch.calls).to.deep.equal([{
          args: [{
            payload: {
              args: ['/'],
              method: 'push'
            },
            type: '@@router/CALL_HISTORY_METHOD'
          }]
        }])
      })
    })
    describe('#resetPassphrase', () => {
      it('should set the passphrase value in the state to empty string', () => {
        const resetPassphrase = actions.resetPassphrase
        const state = Immutable.fromJS({passphrase: {
          value: 'test'
        }})
        const newState = reducer(state, resetPassphrase())
        expect(newState.toJS().passphrase.value).to.equal('')
      })
    })
  })
})
