/* global describe: true, it: true */
import {expect} from 'chai'
import Immutable from 'immutable'
import * as tabs from './tabs'
import * as router from '../router'
import {stub, withStubs} from '../../../../../test/utils'
const reducer = require('./tabs').default
// const helpers = registration.helpers

describe.only('Wallet tabs Redux module', function() {
  it('should switch tabs correctly', () => {
    const dispatch = stub()

    withStubs([
      [router, 'pushRoute', {returns: 'push'}]],
      () => {
        const identityThunk = tabs.switchTab({tab: 'identity'})
        identityThunk(dispatch, 'getState')
        expect(dispatch.calls).to.deep.equal([{args: ['push']}])
        expect(router.pushRoute.calledWithArgs)
          .to.deep.equal(['/wallet/identity'])

        dispatch.reset()
        const moneyThunk = tabs.switchTab({tab: 'money'})
        moneyThunk(dispatch, 'getState')
        expect(dispatch.calls).to.deep.equal([{args: ['push']}])
        expect(router.pushRoute.calledWithArgs)
          .to.deep.equal(['/wallet/money'])
      }
    )
  })
})
