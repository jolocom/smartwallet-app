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
      const action = contact.actions.exitWithoutSaving()
      action(dispatch)
      expect(dispatch.called).to.be.true
      expect(dispatch.calls).to.deep.equal([{
        args: [{
          payload: {
            args: ['/wallet/identity'],
            method: 'push'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        }]
      }])
    })
    it('getAccountInformation should get the user\'s information', () => {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: contact.actions.getAccountInformation.id_success,
        result: {
          emails: [],
          phoneNumbers: []
        }
      }
      state = reducer(state, action)
      expect(state.toJS().loading)
      .to.be.false
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
      it('updateInformation should change an original email field value',
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
      it('updateInformation should not change a verified original email ' +
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
      it('addNewEntry should add a new field to the phoneNumbers array', () => {
        const state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [],
              phoneNumbers: []
            }
          }
        })
        const expectedState = {
          information: {
            newInformation: {
              emails: [],
              phoneNumbers: [{
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
          field: 'phoneNumbers',
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
              phoneNumbers: [
                {value: '', valid: false, delete: false, blank: true}]
            }
          }
        })
        const action = {
          type: contact.actions.deleteInformation.id,
          age: 'newInformation',
          field: 'phoneNumbers',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.phoneNumbers[0].delete)
        .to.be.true
      })
      it('setInformation should change a new field value',
      () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [],
              phoneNumbers: [
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
          field: 'phoneNumbers',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.phoneNumbers[0])
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
              phoneNumbers: [{
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
          field: 'phoneNumbers',
          index: 0
        }
        const newState = reducer(state, action)
        expect(newState.toJS()).to.deep.equal({information: {
          originalInformation: {
            emails: [],
            phoneNumbers: [{
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
      it('updateInformation should not change a valid original telNum field ' +
      'value', () => {
        const oldState = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [],
              phoneNumbers: [{
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
          field: 'phoneNumbers',
          index: 0
        }
        const newState = reducer(oldState, action)
        expect(newState.toJS())
        .to.deep.equal(oldState.toJS())
      })
    })
  })
})
