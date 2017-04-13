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
  })
})
