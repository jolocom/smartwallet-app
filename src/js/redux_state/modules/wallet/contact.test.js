import {expect} from 'chai'
import Immutable from 'immutable'
import * as contact from './contact'
import {stub} from '../../../../../test/utils'

const reducer = require('./contact').default

describe('# Wallet contact redux module', () => {
  describe('# Reducer ', () => {
    it('exitWithoutSaving should redirect the user to the identity screen',
    () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({
        wallet: {
          contact: {
            callback: '/test/test'
          }
        }
      })
      const action = contact.actions.exitWithoutSaving()
      action(dispatch, getState)
      expect(dispatch.called).to.be.true
      expect(dispatch.calls).to.deep.equal([{
        args: [{
          type: 'little-sister/wallet/contact/SET_RELOAD_FROM_BACKEND',
          value: true
        }]
      }, {
        args: [{
          payload: {
            args: ['/test/test'],
            method: 'push'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        }]
      }])
    })
    it('getUserInformation should get the user\'s information', () => {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: contact.actions.getUserInformation.id_success,
        result: {
          callback: '/test/test',
          result: {
            contact: {
              email: [],
              phone: []
            }
          }
        }
      }
      state = reducer(state, action)
      expect(state.toJS().loading).to.be.false
    })
    it('saveChanges should display a spinner while saving Information',
    () => {
      let state = reducer(undefined, '@@INIT')
      const action1 = {
        type: contact.actions.saveChanges.id,
        result: {
        }
      }
      state = reducer(state, action1)
      expect(state.toJS().loading).to.be.true
      const action = {
        type: contact.actions.saveChanges.id_success,
        result: {
        }
      }
      state = reducer(state, action)
      expect(state.toJS().loading).to.be.false
    })
    describe('# Email', () => {
      it('addNewEntry should add a new field to the emails array', () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: []
            }
          }
        })
        const action = {
          type: contact.actions.addNewEntry.id,
          field: 'emails',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.emails.length)
        .to.equal(1)
      })
      it('deleteInformation should mark the requested field for deletion',
      () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [
                {value: '', valid: false, delete: false, blank: true}]
            }
          }
        })
        const action = {
          type: contact.actions.deleteInformation.id,
          age: 'newInformation',
          field: 'emails',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.emails[0].delete)
        .to.be.true
      })
      it('setInformation should change a new field value', () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [
                {value: 'a', valid: false, delete: false, blank: true}]
            }
          }
        })
        const action = {
          type: contact.actions.setInformation.id,
          value: 'ab',
          field: 'emails',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.emails[0].value)
        .to.equal('ab')
      })
      it('updateInformation should change an original emails field value',
      () => {
        let state = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [{value: 'a@example.com', valid: true, delete: false,
                update: false, verified: false}]
            }
          }
        })
        const action = {
          type: contact.actions.updateInformation.id,
          value: 'test',
          field: 'emails',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.originalInformation.emails[0].value)
        .to.equal('test')
        expect(state.toJS().information.originalInformation.emails[0].update)
        .to.be.true
      })
      it('updateInformation should not change a verified original emails ' +
      'field value', () => {
        let oldState = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [{value: 'a@example.com', valid: true, delete: false,
                update: false, verified: true}]
            }
          }
        })
        const action = {
          type: contact.actions.updateInformation.id,
          value: 'test',
          field: 'emails',
          index: 0
        }
        const newState = reducer(oldState, action)
        expect(newState.toJS()).to.deep.equal(oldState.toJS())
      })
    })
    describe('# Phone', () => {
      it('addNewEntry should add a new field to the phones array', () => {
        const state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [],
              phones: []
            }
          }
        })
        const expectedState = {
          information: {
            newInformation: {
              emails: [],
              phones: [{
                value: '',
                type: 'personal',
                verified: false,
                valid: false,
                delete: false,
                blank: true
              }]
            }
          }
        }
        const action = {
          type: contact.actions.addNewEntry.id,
          field: 'phones',
          index: 0
        }
        const newState = reducer(state, action)
        expect(newState.toJS()).to.deep.equal(expectedState)
      })
      it('deleteInformation should mark the requested field for deletion',
      () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              phones: [
                {value: '', valid: false, delete: false, blank: true}]
            }
          }
        })
        const action = {
          type: contact.actions.deleteInformation.id,
          age: 'newInformation',
          field: 'phones',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.phones[0].delete)
        .to.be.true
      })
      it('setInformation should change a new field value',
      () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [],
              phones: [
                {
                  value: '12',
                  type: 'work',
                  valid: false,
                  delete: false,
                  blank: true
                }]
            }
          }
        })
        const action = {
          type: contact.actions.setInformation.id,
          value: {value: '123', type: 'personal'},
          field: 'phones',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.phones[0])
          .to.deep.equal({
            value: '123',
            type: 'personal',
            valid: true,
            delete: false,
            blank: false
          })
      })
      it('updateInformation should change an original phoneNumber field value',
      () => {
        let state = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [],
              phones: [{
                value: '4917912345678',
                type: 'work',
                verified: false,
                delete: false,
                update: false,
                valid: true
              }]
            }
          }
        })
        const action = {
          type: contact.actions.updateInformation.id,
          value: {value: '+4917912345678', type: 'test'},
          field: 'phones',
          index: 0
        }
        const newState = reducer(state, action)
        expect(newState.toJS()).to.deep.equal({information: {
          originalInformation: {
            emails: [],
            phones: [{
              value: '+4917912345678',
              type: 'test',
              verified: false,
              delete: false,
              update: true,
              valid: true
            }]
          }
        }})
      })
      it('updateInformation should not change a valid original telNum field value', () => { // eslint-disable-line max-len
        const oldState = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [],
              phones: [{
                value: '4917912345678',
                type: 'work',
                verified: true,
                delete: false,
                update: false,
                valid: true
              }]
            }
          }
        })
        const action = {
          type: contact.actions.updateInformation.id,
          value: {value: '+4917912345678', type: 'test'},
          field: 'phones',
          index: 0
        }
        const newState = reducer(oldState, action)
        expect(newState.toJS()).to.deep.equal(oldState.toJS())
      })
    })
  })
})
