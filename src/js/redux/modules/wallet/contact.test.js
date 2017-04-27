import {expect} from 'chai'
import Immutable from 'immutable'
import * as contact from './contact'
import {stub} from '../../../../../test/utils'
const reducer = require('./contact').default

describe.only('# Wallet contact redux module', () => {
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
          telNums: []
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
          result: {
          }
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
                {address: '', valid: false, delete: false, blank: true}]
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
                {address: 'a', valid: false, delete: false, blank: true}]
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
        expect(state.toJS().information.newInformation.emails[0].address)
        .to.equal('ab')
      })
      it('updateInformation should change an original email field value',
      () => {
        let state = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [{address: 'a@example.com', valid: true, delete: false,
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
        expect(state.toJS().information.originalInformation.emails[0].address)
        .to.equal('test')
        expect(state.toJS().information.originalInformation.emails[0].update)
        .to.be.true
      })
      it('updateInformation should not change a verified original email ' +
      'field value', () => {
        let oldState = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [{address: 'a@example.com', valid: true, delete: false,
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
      it('addNewEntry should add a new field to the telNums array', () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [],
              telNums: []
            }
          }
        })
        const action = {
          type: contact.actions.addNewEntry.id,
          field: 'telNums',
          result: {
          }
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
              telNums: [
                {num: '', valid: false, delete: false, blank: true}]
            }
          }
        })
        const action = {
          type: contact.actions.deleteInformation.id,
          age: 'newInformation',
          field: 'telNums',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.telNums[0].delete)
        .to.be.true
      })
      it('setInformation should change a new field value',
      () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [],
              telNums: [
                {
                  num: '12',
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
          value: {num: '123', type: 'home'},
          field: 'telNums',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.newInformation.telNums[0])
          .to.deep.equal({
            num: '123',
            type: 'home',
            valid: true,
            delete: false,
            blank: false
          })
      })
      it('updateInformation should change an original telNum field value',
      () => {
        let state = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [],
              telNums: [{
                num: '4917912345678',
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
          value: {num: '+4917912345678', type: 'test'},
          field: 'telNums',
          index: 0
        }
        state = reducer(state, action)
        expect(state.toJS().information.originalInformation.telNums[0].num)
        .to.equal('+4917912345678')
        expect(state.toJS().information.originalInformation.telNums[0].type)
        .to.equal('test')
        expect(state.toJS().information.originalInformation.telNums[0].update)
        .to.be.true
      })
      it('updateInformation should not change a valid original telNum field ' +
      'value', () => {
        const oldState = Immutable.fromJS({
          information: {
            originalInformation: {
              emails: [],
              telNums: [{
                num: '4917912345678',
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
          value: {num: '+4917912345678', type: 'test'},
          field: 'telNums',
          index: 0
        }
        const newState = reducer(oldState, action)
        expect(newState.toJS())
        .to.deep.equal(oldState.toJS())
      })
    })
  })
})
