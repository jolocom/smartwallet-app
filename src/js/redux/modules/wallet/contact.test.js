import {expect} from 'chai'
import Immutable from 'immutable'
import * as contact from './contact'
// import * as router from '../router'
import {stub} from '../../../../../test/utils'
const reducer = require('./contact').default

describe.only('# Wallet contact redux module', () => {
  describe('# actions ', () => {
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
        }
      }
      state = reducer(state, action)
      expect(state.toJS().loading)
        .to.be.false
    })
    it('saveChanges should display display a spinner while saving Information',
      () => {
        let state = reducer(undefined, '@@INIT')
        const action1 = {
          type: contact.actions.saveChanges.id,
          result: {
          }
        }
        state = reducer(state, action1)
        expect(state.toJS().loading)
          .to.be.true
        const action2 = {
          type: contact.actions.saveChanges.id_success,
          result: {
          }
        }
        state = reducer(state, action2)
        expect(state.toJS().loading)
          .to.be.false
      }
    )
    it('addNewEntry should add a new field to the emails array',
    () => {
      let state = Immutable.fromJS({
        information: {
          newInformation: {
            emails: []
          }
        }
      })
      const action = {
        type: contact.actions.addNewEntry.id,
        result: {
        }
      }
      state = reducer(state, action)
      expect(state.toJS().information.newInformation.emails.length)
      .to.equal(1)
    }
  )
    it('deleteInformation should mark the requested field for deletion',
      () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [{address: '', valid: false, delete: false, blank: true}]
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
    it('setInformation should change a new field value',
      () => {
        let state = Immutable.fromJS({
          information: {
            newInformation: {
              emails: [{address: 'a', valid: false, delete: false, blank: true}]
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
    it('updateInformation should change an original field value',
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
  })
})
