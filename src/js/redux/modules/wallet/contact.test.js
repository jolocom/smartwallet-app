import {expect} from 'chai'
import Immutable from 'immutable'
import * as contact from './contact'
// import * as router from '../router'
import {stub, withStubs} from '../../../../../test/utils'
const reducer = require('./contact').default

describe('# Wallet contact redux module', () => {
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
    // it('saveChanges should redirect the user to the identity screen',
    //   () => {
    //     const dispatch = stub()
    //     const thunk = contact.actions.saveChanges()
    //     thunk(dispatch)
    //     expect(dispatch.called).to.be.true
    //     expect(dispatch.calls).to.deep.equal([{
    //       args: [{
    //         payload: {
    //           args: ['/wallet/identity'],
    //           method: 'push'
    //         },
    //         type: '@@router/CALL_HISTORY_METHOD'
    //       }]
    //     }])
    //   }
    // )
  })
})
