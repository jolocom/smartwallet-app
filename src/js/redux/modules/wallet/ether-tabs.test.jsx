import {expect} from 'chai'
import * as etherTabs from './ether-tabs'
import * as router from '../router'
import {stub, withStubs} from '../../../../../test/utils'
const reducer = require('./ether-tabs').default

describe('Wallet Ether Tabs Redux Module', function() {
  it('should switch ether tabs correctly', () => {
    const dispatch = stub()

    withStubs([
      [router, 'pushRoute', {returns: 'push'}]], () => {
      const etherThunk = etherTabs.switchTab({tab: 'overview'})
      etherThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/ether'])

      dispatch.reset()

      const etherSendThunk = etherTabs.switchTab({tab: 'send'})
      etherSendThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/ether/send']) // eslint-disable-line max-len

      dispatch.reset()

      const etherReceiveThunk = etherTabs.switchTab({tab: 'receive'})
      etherReceiveThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/ether/receive']) // eslint-disable-line max-len
    })
  })
  it('should correctly detect active tab', function() {
    let state = reducer(undefined, '@@INIT')

    state = reducer(state, etherTabs.detectActiveTab({path: '/wallet/ether'}))
    expect(state.get('activeTab')).to.equal('overview')

    state = reducer(state, etherTabs.detectActiveTab({path: '/wallet/ether/receive'})) // eslint-disable-line max-len
    expect(state.get('activeTab')).to.equal('receive')

    state = reducer(state, etherTabs.detectActiveTab({path: '/wallet/ether/send'})) // eslint-disable-line max-len
    expect(state.get('activeTab')).to.equal('send')

    state = reducer(state, etherTabs.detectActiveTab({path: '/wallet'}))
    expect(state.get('activeTab')).to.equal('overview')
  })
  it('should go to proper screen when navigating', function() {
    const dispatch = stub()

    withStubs([
      [router, 'pushRoute', {returns: 'push'}]], () => {
      const walletThunk = etherTabs.goToWalletScreen()
      walletThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/money'])

      dispatch.reset()

      const closeAccountThunk = etherTabs.closeAccountDetails()
      closeAccountThunk(dispatch, 'getState')
      expect(dispatch.calls).to.deep.equal([{args: ['push']}])
      expect(router.pushRoute.calledWithArgs).to.deep.equal(['/wallet/ether'])
    })
  })
  it('should get wallet address on getWalletAddress', function() {
    let state = reducer(undefined, '@@INIT')
    const action = {
      type: etherTabs.actions.getWalletAddress.id_success,
      value: '0xTESTTEST111222'
    }
    state = reducer(state, action)
    expect(state.toJS()).to.deep.equal({
      activeTab: 'overview',
      wallet: {
        loading: false,
        mainAddress: '0xTESTTEST111222',
        amount: '',
        receiverAddress: '',
        amountSend: '',
        pin: '1234',
        data: '',
        gasInWei: '200'
      }
    })
  })
  it('should get the ether balance on getBalance', function() {
    let state = reducer(undefined, '@@INIT')
    const action = {
      type: etherTabs.actions.getBalance.id_success,
      result: '4321'
    }
    state = reducer(state, action)
    expect(state.toJS()).to.deep.equal({
      activeTab: 'overview',
      wallet: {
        loading: false,
        mainAddress: '',
        amount: 4321,
        receiverAddress: '',
        amountSend: '',
        pin: '1234',
        data: '',
        gasInWei: '200'
      }
    })
  })
  it('should update correct field in state on updateField', function() {
    let state = reducer(undefined, '@@INIT')
    const action = {
      type: etherTabs.actions.updateField.id,
      field: 'receiverAddress',
      value: '0xONENICETEST'
    }
    state = reducer(state, action)
    expect(state.toJS()).to.deep.equal({
      activeTab: 'overview',
      wallet: {
        loading: false,
        mainAddress: '',
        amount: '',
        receiverAddress: '0xONENICETEST',
        amountSend: '',
        pin: '1234',
        data: '',
        gasInWei: '200'
      }
    })
  })
  it('should get confirmation on sendEther and set loading to false', function() { // eslint-disable-line max-len
    let state = reducer(undefined, '@@INIT')
    const action = {
      type: etherTabs.actions.sendEther.id_success,
      result: 'send OK'
    }
    state = reducer(state, action)
    expect(state.toJS()).to.deep.equal({
      activeTab: 'overview',
      wallet: {
        loading: false,
        mainAddress: '',
        amount: '',
        receiverAddress: '',
        amountSend: '',
        pin: '1234',
        data: '',
        gasInWei: '200'
      }
    })
  })
})
