import {expect} from 'chai'
import { actions } from './ether-tabs'
import * as router from '../router'
import { pushRoute } from '../router'
import {stub, withStubs} from '../../../../../test/utils'
import reducer from './ether-tabs'

describe('Wallet Ether Tabs Redux Module', function() {
  it('should switch ether tabs correctly', () => {
    const dispatch = stub()
    withStubs([
      [router, 'pushRoute', {returns: 'push'}]], () => {
      const etherThunk = actions.switchTab({tab: 'overview'})
      etherThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/ether'])

      dispatch.reset()

      const etherSendThunk = actions.switchTab({tab: 'send'})
      etherSendThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/ether/send']) // eslint-disable-line max-len

      dispatch.reset()

      const etherReceiveThunk = actions.switchTab({tab: 'receive'})
      etherReceiveThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/ether/receive']) // eslint-disable-line max-len
    })
  })
  it('should correctly detect active tab', function() {
    let state = reducer(undefined, '@@INIT')
    state = reducer(state, actions.detectActiveTab({path: '/wallet/ether'}))
    expect(state.get('activeTab')).to.equal('overview')

    state = reducer(state, actions.detectActiveTab({path: '/wallet/ether/receive'})) // eslint-disable-line max-len
    expect(state.get('activeTab')).to.equal('receive')

    state = reducer(state, actions.detectActiveTab({path: '/wallet/ether/send'})) // eslint-disable-line max-len
    expect(state.get('activeTab')).to.equal('send')

    state = reducer(state, actions.detectActiveTab({path: '/wallet'}))
    expect(state.get('activeTab')).to.equal('overview')
  })
  it('should go to proper screen when navigating', function() {
    const dispatch = stub()

    withStubs([
      [router, 'pushRoute', {returns: 'push'}]], () => {
      const walletThunk = actions.goToWalletScreen()
      walletThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/money'])

      dispatch.reset()

      const closeAccountThunk = actions.closeAccountDetails()
      closeAccountThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/ether'])
    })
  })
  it('should update correct field in state on updateField', function() {
    let state = reducer(undefined, '@@INIT')
    const action = {
      type: actions.updateField.id,
      field: 'receiverAddress',
      value: '0xONENICETEST'
    }
    state = reducer(state, action)
    expect(state.toJS()).to.deep.equal({
      activeTab: 'overview',
      wallet: {
        loading: false,
        errorMsg: '',
        receiverAddress: '0xONENICETEST',
        amountSend: '',
        pin: '1234',
        data: '',
        gasInWei: 3000000
      }
    })
  })
  it('should get confirmation on sendEther and set loading to false', function() { // eslint-disable-line max-len
    let state = reducer(undefined, '@@INIT')
    const action = {
      type: actions.sendEther.id_success,
      result: 'send OK'
    }
    state = reducer(state, action)
    expect(state.toJS()).to.deep.equal({
      activeTab: 'overview',
      wallet: {
        loading: false,
        errorMsg: '',
        receiverAddress: '',
        amountSend: '',
        pin: '1234',
        data: '',
        gasInWei: 3000000
      }
    })
  })
})
