import {expect} from 'chai'
import {stub} from '../../../../test/utils'
import {actions, default as reducer} from './account'

describe('Account module reducer', function() {
  describe('checkIfAccountExists', () => {
    it('should correcly detect existing account', async () => {
      const dispatch = stub()
      const services = {
        storage: { getItem: async () => 'mockDid' }
      }
      const promise = actions.checkIfAccountExists()
      await promise(dispatch, {}, {services})

      const expectedDispatchCalls = [{
        args: [ { did: 'mockDid', type: 'account/SET_DID' } ]
      }, {
        args: [{
          payload: { args: [ '/wallet/identity' ], method: 'push' },
          type: '@@router/CALL_HISTORY_METHOD'
        }]
      }]

      expect(dispatch.calls).to.deep.equal(expectedDispatchCalls)
    })

    it('should correctly detect non existing account', async () => {
      const dispatch = stub()
      const services = {
        storage: { getItem: async () => undefined }
      }

      const promise = actions.checkIfAccountExists()
      await promise(dispatch, {}, {services})

      expect(dispatch.called).to.equal(false)
    })
  })

  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        did: ''
      })
    })
  })
})
