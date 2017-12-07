/* global describe: true, it: true */
import {expect} from 'chai'
import { actions } from './tabs'
import router from '../router'
import {stub, withStubs} from '../../../../../test/utils'
import reducer from './tabs'
// const helpers = registration.helpers

describe('Wallet tabs Redux module', function() {
  it('should switch tabs correctly', () => {
    const dispatch = stub()

    withStubs([
      [router, 'pushRoute', {returns: 'push'}]],
      () => {
        const identityThunk = actions.switchTab({tab: 'identity'})
        identityThunk(dispatch, 'getState')
        expect(dispatch.calls).to.deep.equal([{args: ['push']}])
        expect(router.pushRoute.calledWithArgs)
          .to.deep.equal(['/wallet/identity'])

        dispatch.reset()
        const moneyThunk = actions.switchTab({tab: 'money'})
        moneyThunk(dispatch, 'getState')
        expect(dispatch.calls).to.deep.equal([{args: ['push']}])
        expect(router.pushRoute.calledWithArgs)
          .to.deep.equal(['/wallet/money'])
      }
    )
  })

  it('should correctly detect active tab', function() {
    let state = reducer(undefined, '@@INIT')

    state = reducer(state, actions.detectActiveTab({path: '/wallet/identity'}))
    expect(state.get('activeTab')).to.equal('identity')

    state = reducer(state, actions.detectActiveTab({path: '/wallet/money'}))
    expect(state.get('activeTab')).to.equal('money')

    state = reducer(state, actions.detectActiveTab({path: '/wallet'}))
    expect(state.get('activeTab')).to.equal(null)
  })
})
